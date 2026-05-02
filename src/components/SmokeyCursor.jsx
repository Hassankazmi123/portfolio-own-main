"use client";
import React, { useEffect, useRef } from "react";

function pointerPrototype() {
  return {
    id: -1,
    texcoordX: 0,
    texcoordY: 0,
    prevTexcoordX: 0,
    prevTexcoordY: 0,
    deltaX: 0,
    deltaY: 0,
    down: false,
    moved: false,
    color: { r: 0, g: 0, b: 0 },
  };
}

function hashCode(s) {
  if (!s.length) return 0;
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = (hash << 5) - hash + s.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function addKeywords(source, keywords) {
  if (!keywords) return source;
  let keywordsString = "";
  for (const keyword of keywords) {
    keywordsString += `#define ${keyword}\n`;
  }
  return keywordsString + source;
}

function compileShader(gl, type, source, keywords = null) {
  const shaderSource = addKeywords(source, keywords);
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.trace(gl.getShaderInfoLog(shader));
  }
  return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
  if (!vertexShader || !fragmentShader) return null;
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.trace(gl.getProgramInfoLog(program));
  }
  return program;
}

function getUniforms(gl, program) {
  let uniforms = {};
  const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < uniformCount; i++) {
    const uniformInfo = gl.getActiveUniform(program, i);
    if (uniformInfo) {
      uniforms[uniformInfo.name] = gl.getUniformLocation(
        program,
        uniformInfo.name,
      );
    }
  }
  return uniforms;
}

function HSVtoRGB(h, s, v) {
  let r = 0,
    g = 0,
    b = 0;
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0:
      r = v;
      g = t;
      b = p;
      break;
    case 1:
      r = q;
      g = v;
      b = p;
      break;
    case 2:
      r = p;
      g = v;
      b = t;
      break;
    case 3:
      r = p;
      g = q;
      b = v;
      break;
    case 4:
      r = t;
      g = p;
      b = v;
      break;
    case 5:
      r = v;
      g = p;
      b = q;
      break;
  }
  return { r, g, b };
}

function generateColor() {
  const c = HSVtoRGB(Math.random(), 1.0, 1.0);
  c.r *= 0.15;
  c.g *= 0.15;
  c.b *= 0.15;
  return c;
}

function wrap(value, min, max) {
  const range = max - min;
  if (range === 0) return min;
  return ((value - min) % range) + min;
}

class Program {
  constructor(gl, vertexShader, fragmentShader) {
    this.gl = gl;
    this.program = createProgram(gl, vertexShader, fragmentShader);
    this.uniforms = this.program ? getUniforms(gl, this.program) : {};
  }

  bind() {
    if (this.program) this.gl.useProgram(this.program);
  }
}

class Material {
  constructor(gl, vertexShader, fragmentShaderSource) {
    this.gl = gl;
    this.vertexShader = vertexShader;
    this.fragmentShaderSource = fragmentShaderSource;
    this.programs = {};
    this.activeProgram = null;
    this.uniforms = {};
  }

  setKeywords(keywords) {
    let hash = 0;
    for (const kw of keywords) {
      hash += hashCode(kw);
    }
    let program = this.programs[hash];
    if (program == null) {
      const fragmentShader = compileShader(
        this.gl,
        this.gl.FRAGMENT_SHADER,
        this.fragmentShaderSource,
        keywords,
      );
      program = createProgram(this.gl, this.vertexShader, fragmentShader);
      this.programs[hash] = program;
    }
    if (program === this.activeProgram) return;
    if (program) {
      this.uniforms = getUniforms(this.gl, program);
    }
    this.activeProgram = program;
  }

  bind() {
    if (this.activeProgram) {
      this.gl.useProgram(this.activeProgram);
    }
  }
}

export default function SmokeyCursor({
  simulationResolution = 64,
  dyeResolution = 512,
  captureResolution = 256,
  densityDissipation = 3.5,
  velocityDissipation = 2,
  pressure = 0.1,
  pressureIterations = 10,
  curl = 3,
  splatRadius = 0.2,
  splatForce = 6000,
  enableShading = true,
  colorUpdateSpeed = 10,
  backgroundColor = { r: 0.5, g: 0, b: 0 },
  transparent = true,
  className = "",
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      return;
    }

    let pointers = [pointerPrototype()];

    let config = {
      SIM_RESOLUTION: simulationResolution,
      DYE_RESOLUTION: dyeResolution,
      CAPTURE_RESOLUTION: captureResolution,
      DENSITY_DISSIPATION: densityDissipation,
      VELOCITY_DISSIPATION: velocityDissipation,
      PRESSURE: pressure,
      PRESSURE_ITERATIONS: pressureIterations,
      CURL: curl,
      SPLAT_RADIUS: splatRadius,
      SPLAT_FORCE: splatForce,
      SHADING: enableShading,
      COLOR_UPDATE_SPEED: colorUpdateSpeed,
      PAUSED: false,
      BACK_COLOR: backgroundColor,
      TRANSPARENT: transparent,
    };

    const initWebGL = (canvas) => {
      const params = {
        alpha: true,
        depth: false,
        stencil: false,
        antialias: false,
        preserveDrawingBuffer: false,
      };
      let gl = canvas.getContext("webgl2", params);
      if (!gl)
        gl =
          canvas.getContext("webgl", params) ||
          canvas.getContext("experimental-webgl", params);
      if (!gl) throw new Error("Unable to initialize WebGL.");

      const isWebGL2 = "drawBuffers" in gl;
      let supportLinearFiltering = false;
      let halfFloat = null;

      if (isWebGL2) {
        gl.getExtension("EXT_color_buffer_float");
        supportLinearFiltering = !!gl.getExtension("OES_texture_float_linear");
      } else {
        halfFloat = gl.getExtension("OES_texture_half_float");
        supportLinearFiltering = !!gl.getExtension(
          "OES_texture_half_float_linear",
        );
      }

      gl.clearColor(0, 0, 0, 1);
      const halfFloatTexType = isWebGL2
        ? gl.HALF_FLOAT
        : (halfFloat && halfFloat.HALF_FLOAT_OES) || 0;

      const getSupportedFmt = (gl, internalFormat, format, type) => {
        if (!supportFmt(gl, internalFormat, format, type)) {
          if ("drawBuffers" in gl) {
            switch (internalFormat) {
              case gl.R16F:
                return getSupportedFmt(gl, gl.RG16F, gl.RG, type);
              case gl.RG16F:
                return getSupportedFmt(gl, gl.RGBA16F, gl.RGBA, type);
              default:
                return null;
            }
          }
          return null;
        }
        return { internalFormat, format };
      };

      const supportFmt = (gl, internalFormat, format, type) => {
        const texture = gl.createTexture();
        if (!texture) return false;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          internalFormat,
          4,
          4,
          0,
          format,
          type,
          null,
        );
        const fbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(
          gl.FRAMEBUFFER,
          gl.COLOR_ATTACHMENT0,
          gl.TEXTURE_2D,
          texture,
          0,
        );
        return (
          gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE
        );
      };

      let formatRGBA, formatRG, formatR;
      if (isWebGL2) {
        formatRGBA = getSupportedFmt(gl, gl.RGBA16F, gl.RGBA, halfFloatTexType);
        formatRG = getSupportedFmt(gl, gl.RG16F, gl.RG, halfFloatTexType);
        formatR = getSupportedFmt(gl, gl.R16F, gl.RED, halfFloatTexType);
      } else {
        formatRGBA = getSupportedFmt(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
        formatRG = getSupportedFmt(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
        formatR = getSupportedFmt(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
      }

      return {
        gl,
        ext: {
          formatRGBA,
          formatRG,
          formatR,
          halfFloatTexType,
          supportLinearFiltering,
        },
      };
    };

    const { gl, ext } = initWebGL(canvas);
    if (!gl || !ext) return;

    if (!ext.supportLinearFiltering) {
      config.DYE_RESOLUTION = 256;
      config.SHADING = false;
    }

    const baseVertexShader = compileShader(
      gl,
      gl.VERTEX_SHADER,
      `
      precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform vec2 texelSize;
      void main () {
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `,
    );

    const copyShader = compileShader(
      gl,
      gl.FRAGMENT_SHADER,
      `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      uniform sampler2D uTexture;
      void main () { gl_FragColor = texture2D(uTexture, vUv); }
    `,
    );

    const clearShader = compileShader(
      gl,
      gl.FRAGMENT_SHADER,
      `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      uniform sampler2D uTexture;
      uniform float value;
      void main () { gl_FragColor = value * texture2D(uTexture, vUv); }
    `,
    );

    const splatShader = compileShader(
      gl,
      gl.FRAGMENT_SHADER,
      `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uTarget;
      uniform float aspectRatio;
      uniform vec3 color;
      uniform vec2 point;
      uniform float radius;
      void main () {
          vec2 p = vUv - point.xy;
          p.x *= aspectRatio;
          vec3 splat = exp(-dot(p, p) / radius) * color;
          vec3 base = texture2D(uTarget, vUv).xyz;
          gl_FragColor = vec4(base + splat, 1.0);
      }
    `,
    );

    const advectionShader = compileShader(
      gl,
      gl.FRAGMENT_SHADER,
      `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 texelSize;
      uniform vec2 dyeTexelSize;
      uniform float dt;
      uniform float dissipation;
      vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
          vec2 st = uv / tsize - 0.5;
          vec2 iuv = floor(st);
          vec2 fuv = fract(st);
          vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
          vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
          vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
          vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
          return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
      }
      void main () {
          #ifdef MANUAL_FILTERING
              vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
              vec4 result = bilerp(uSource, coord, dyeTexelSize);
          #else
              vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
              vec4 result = texture2D(uSource, coord);
          #endif
          gl_FragColor = result / (1.0 + dissipation * dt);
      }
    `,
      ext.supportLinearFiltering ? null : ["MANUAL_FILTERING"],
    );

    const divergenceShader = compileShader(
      gl,
      gl.FRAGMENT_SHADER,
      `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;
      void main () {
          float L = texture2D(uVelocity, vL).x;
          float R = texture2D(uVelocity, vR).x;
          float T = texture2D(uVelocity, vT).y;
          float B = texture2D(uVelocity, vB).y;
          vec2 C = texture2D(uVelocity, vUv).xy;
          if (vL.x < 0.0) { L = -C.x; }
          if (vR.x > 1.0) { R = -C.x; }
          if (vT.y > 1.0) { T = -C.y; }
          if (vB.y < 0.0) { B = -C.y; }
          gl_FragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
      }
    `,
    );

    const curlShader = compileShader(
      gl,
      gl.FRAGMENT_SHADER,
      `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;
      void main () {
          float L = texture2D(uVelocity, vL).y;
          float R = texture2D(uVelocity, vR).y;
          float T = texture2D(uVelocity, vT).x;
          float B = texture2D(uVelocity, vB).x;
          gl_FragColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
      }
    `,
    );

    const vorticityShader = compileShader(
      gl,
      gl.FRAGMENT_SHADER,
      `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;
      uniform sampler2D uCurl;
      uniform float curl;
      uniform float dt;
      void main () {
          float L = texture2D(uCurl, vL).x;
          float R = texture2D(uCurl, vR).x;
          float T = texture2D(uCurl, vT).x;
          float B = texture2D(uCurl, vB).x;
          float C = texture2D(uCurl, vUv).x;
          vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
          force /= length(force) + 0.0001;
          force *= curl * C;
          force.y *= -1.0;
          gl_FragColor = vec4(texture2D(uVelocity, vUv).xy + force * dt, 0.0, 1.0);
      }
    `,
    );

    const pressureShader = compileShader(
      gl,
      gl.FRAGMENT_SHADER,
      `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uDivergence;
      void main () {
          float L = texture2D(uPressure, vL).x;
          float R = texture2D(uPressure, vR).x;
          float T = texture2D(uPressure, vT).x;
          float B = texture2D(uPressure, vB).x;
          float divergence = texture2D(uDivergence, vUv).x;
          gl_FragColor = vec4((L + R + B + T - divergence) * 0.25, 0.0, 0.0, 1.0);
      }
    `,
    );

    const gradientSubtractShader = compileShader(
      gl,
      gl.FRAGMENT_SHADER,
      `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uVelocity;
      void main () {
          float L = texture2D(uPressure, vL).x;
          float R = texture2D(uPressure, vR).x;
          float T = texture2D(uPressure, vT).x;
          float B = texture2D(uPressure, vB).x;
          vec2 velocity = texture2D(uVelocity, vUv).xy;
          velocity.xy -= vec2(R - L, T - B);
          gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `,
    );

    const displayShaderSource = `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uTexture;
      uniform vec2 texelSize;
      void main () {
          vec3 c = texture2D(uTexture, vUv).rgb;
          #ifdef SHADING
              vec3 lc = texture2D(uTexture, vL).rgb;
              vec3 rc = texture2D(uTexture, vR).rgb;
              vec3 tc = texture2D(uTexture, vT).rgb;
              vec3 bc = texture2D(uTexture, vB).rgb;
              float dx = length(rc) - length(lc);
              float dy = length(tc) - length(bc);
              vec3 n = normalize(vec3(dx, dy, length(texelSize)));
              c *= clamp(dot(n, vec3(0.0, 0.0, 1.0)) + 0.7, 0.7, 1.0);
          #endif
          gl_FragColor = vec4(c, max(c.r, max(c.g, c.b)));
      }
    `;

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
      gl.STATIC_DRAW,
    );
    const elemBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elemBuffer);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array([0, 1, 2, 0, 2, 3]),
      gl.STATIC_DRAW,
    );
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    const blit = (target, doClear = false) => {
      if (!target) {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      } else {
        gl.viewport(0, 0, target.width, target.height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
      }
      if (doClear) {
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    };

    const createFBO = (w, h, internalFormat, format, type, param) => {
      gl.activeTexture(gl.TEXTURE0);
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        internalFormat,
        w,
        h,
        0,
        format,
        type,
        null,
      );
      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        texture,
        0,
      );
      return {
        texture,
        fbo,
        width: w,
        height: h,
        texX: 1 / w,
        texY: 1 / h,
        attach: (id) => {
          gl.activeTexture(gl.TEXTURE0 + id);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          return id;
        },
      };
    };

    const createDoubleFBO = (w, h, iF, f, t, p) => {
      let f1 = createFBO(w, h, iF, f, t, p),
        f2 = createFBO(w, h, iF, f, t, p);
      return {
        width: w,
        height: h,
        texX: f1.texX,
        texY: f1.texY,
        read: f1,
        write: f2,
        swap() {
          let tmp = this.read;
          this.read = this.write;
          this.write = tmp;
        },
      };
    };

    const simRes = (r) => {
      let w = gl.drawingBufferWidth,
        h = gl.drawingBufferHeight,
        ar = w / h;
      return ar > 1
        ? { w: Math.round(r * ar), h: r }
        : { w: r, h: Math.round(r / ar) };
    };

    let dye, velocity, divergence, curlFBO, pressureFBO;
    const initFBOs = () => {
      const s = simRes(config.SIM_RESOLUTION),
        d = simRes(config.DYE_RESOLUTION),
        t = ext.halfFloatTexType,
        f = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;
      dye = createDoubleFBO(
        d.w,
        d.h,
        ext.formatRGBA.internalFormat,
        ext.formatRGBA.format,
        t,
        f,
      );
      velocity = createDoubleFBO(
        s.w,
        s.h,
        ext.formatRG.internalFormat,
        ext.formatRG.format,
        t,
        f,
      );
      divergence = createFBO(
        s.w,
        s.h,
        ext.formatR.internalFormat,
        ext.formatR.format,
        t,
        gl.NEAREST,
      );
      curlFBO = createFBO(
        s.w,
        s.h,
        ext.formatR.internalFormat,
        ext.formatR.format,
        t,
        gl.NEAREST,
      );
      pressureFBO = createDoubleFBO(
        s.w,
        s.h,
        ext.formatR.internalFormat,
        ext.formatR.format,
        t,
        gl.NEAREST,
      );
    };

    const copyProgram = new Program(gl, baseVertexShader, copyShader);
    const clearProgram = new Program(gl, baseVertexShader, clearShader);
    const splatProgram = new Program(gl, baseVertexShader, splatShader);
    const advectionProgram = new Program(gl, baseVertexShader, advectionShader);
    const divergenceProgram = new Program(
      gl,
      baseVertexShader,
      divergenceShader,
    );
    const curlProgram = new Program(gl, baseVertexShader, curlShader);
    const vorticityProgram = new Program(gl, baseVertexShader, vorticityShader);
    const pressureProgram = new Program(gl, baseVertexShader, pressureShader);
    const gradSubtractProgram = new Program(
      gl,
      baseVertexShader,
      gradientSubtractShader,
    );
    const displayMat = new Material(gl, baseVertexShader, displayShaderSource);

    initFBOs();
    displayMat.setKeywords(config.SHADING ? ["SHADING"] : []);

    let lastTime = Date.now(),
      colorTimer = 0;
    const animate = () => {
      const now = Date.now(),
        dt = Math.min((now - lastTime) / 1000, 0.016);
      lastTime = now;
      const w = Math.floor(canvas.clientWidth * (window.devicePixelRatio || 1)),
        h = Math.floor(canvas.clientHeight * (window.devicePixelRatio || 1));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        initFBOs();
      }

      colorTimer += dt * config.COLOR_UPDATE_SPEED;
      if (colorTimer >= 1) {
        colorTimer = wrap(colorTimer, 0, 1);
        pointers.forEach((p) => (p.color = generateColor()));
      }

      pointers.forEach((p) => {
        if (p.moved) {
          p.moved = false;
          const dx = p.deltaX * config.SPLAT_FORCE,
            dy = p.deltaY * config.SPLAT_FORCE;
          const splatFn = (prog, target, col) => {
            prog.bind();
            gl.uniform1i(prog.uniforms.uTarget, target.read.attach(0));
            gl.uniform1f(
              prog.uniforms.aspectRatio,
              canvas.width / canvas.height,
            );
            gl.uniform2f(prog.uniforms.point, p.texcoordX, p.texcoordY);
            gl.uniform3f(prog.uniforms.color, col.r, col.g, col.b);
            gl.uniform1f(
              prog.uniforms.radius,
              canvas.width / canvas.height > 1
                ? (config.SPLAT_RADIUS / 100) * (canvas.width / canvas.height)
                : config.SPLAT_RADIUS / 100,
            );
            blit(target.write);
            target.swap();
          };
          splatFn(splatProgram, velocity, { r: dx, g: dy, b: 0 });
          splatFn(splatProgram, dye, p.color);
        }
      });

      gl.disable(gl.BLEND);
      curlProgram.bind();
      gl.uniform2f(
        curlProgram.uniforms.texelSize,
        velocity.texX,
        velocity.texY,
      );
      gl.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0));
      blit(curlFBO);
      vorticityProgram.bind();
      gl.uniform2f(
        vorticityProgram.uniforms.texelSize,
        velocity.texX,
        velocity.texY,
      );
      gl.uniform1i(
        vorticityProgram.uniforms.uVelocity,
        velocity.read.attach(0),
      );
      gl.uniform1i(vorticityProgram.uniforms.uCurl, curlFBO.attach(1));
      gl.uniform1f(vorticityProgram.uniforms.curl, config.CURL);
      gl.uniform1f(vorticityProgram.uniforms.dt, dt);
      blit(velocity.write);
      velocity.swap();
      divergenceProgram.bind();
      gl.uniform2f(
        divergenceProgram.uniforms.texelSize,
        velocity.texX,
        velocity.texY,
      );
      gl.uniform1i(
        divergenceProgram.uniforms.uVelocity,
        velocity.read.attach(0),
      );
      blit(divergence);
      clearProgram.bind();
      gl.uniform1i(clearProgram.uniforms.uTexture, pressureFBO.read.attach(0));
      gl.uniform1f(clearProgram.uniforms.value, config.PRESSURE);
      blit(pressureFBO.write);
      pressureFBO.swap();
      pressureProgram.bind();
      gl.uniform2f(
        pressureProgram.uniforms.texelSize,
        velocity.texX,
        velocity.texY,
      );
      gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence.attach(0));
      for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
        gl.uniform1i(
          pressureProgram.uniforms.uPressure,
          pressureFBO.read.attach(1),
        );
        blit(pressureFBO.write);
        pressureFBO.swap();
      }
      gradSubtractProgram.bind();
      gl.uniform2f(
        gradSubtractProgram.uniforms.texelSize,
        velocity.texX,
        velocity.texY,
      );
      gl.uniform1i(
        gradSubtractProgram.uniforms.uPressure,
        pressureFBO.read.attach(0),
      );
      gl.uniform1i(
        gradSubtractProgram.uniforms.uVelocity,
        velocity.read.attach(1),
      );
      blit(velocity.write);
      velocity.swap();
      advectionProgram.bind();
      gl.uniform2f(
        advectionProgram.uniforms.texelSize,
        velocity.texX,
        velocity.texY,
      );
      if (!ext.supportLinearFiltering)
        gl.uniform2f(
          advectionProgram.uniforms.dyeTexelSize,
          velocity.texX,
          velocity.texY,
        );
      gl.uniform1i(
        advectionProgram.uniforms.uVelocity,
        velocity.read.attach(0),
      );
      gl.uniform1i(advectionProgram.uniforms.uSource, velocity.read.attach(0));
      gl.uniform1f(advectionProgram.uniforms.dt, dt);
      gl.uniform1f(
        advectionProgram.uniforms.dissipation,
        config.VELOCITY_DISSIPATION,
      );
      blit(velocity.write);
      velocity.swap();
      if (!ext.supportLinearFiltering)
        gl.uniform2f(
          advectionProgram.uniforms.dyeTexelSize,
          dye.texX,
          dye.texY,
        );
      gl.uniform1i(
        advectionProgram.uniforms.uVelocity,
        velocity.read.attach(0),
      );
      gl.uniform1i(advectionProgram.uniforms.uSource, dye.read.attach(1));
      gl.uniform1f(
        advectionProgram.uniforms.dissipation,
        config.DENSITY_DISSIPATION,
      );
      blit(dye.write);
      dye.swap();

      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.enable(gl.BLEND);
      displayMat.bind();
      if (config.SHADING)
        gl.uniform2f(
          displayMat.uniforms.texelSize,
          1 / canvas.width,
          1 / canvas.height,
        );
      gl.uniform1i(displayMat.uniforms.uTexture, dye.read.attach(0));
      blit(null);
      requestAnimationFrame(animate);
    };

    const handleDown = (x, y, id) => {
      const p = pointers[0];
      p.id = id;
      p.down = true;
      p.moved = false;
      p.texcoordX = x / canvas.width;
      p.texcoordY = 1 - y / canvas.height;
      p.prevTexcoordX = p.texcoordX;
      p.prevTexcoordY = p.texcoordY;
      p.deltaX = 0;
      p.deltaY = 0;
      p.color = generateColor();
    };
    const handleMove = (x, y) => {
      const p = pointers[0];
      p.prevTexcoordX = p.texcoordX;
      p.prevTexcoordY = p.texcoordY;
      p.texcoordX = x / canvas.width;
      p.texcoordY = 1 - y / canvas.height;
      let dx = p.texcoordX - p.prevTexcoordX,
        dy = p.texcoordY - p.prevTexcoordY,
        ar = canvas.width / canvas.height;
      p.deltaX = ar < 1 ? dx * ar : dx;
      p.deltaY = ar > 1 ? dy / ar : dy;
      p.moved = Math.abs(p.deltaX) > 0 || Math.abs(p.deltaY) > 0;
    };
    const mdown = (e) => {
      handleDown(
        e.clientX * (window.devicePixelRatio || 1),
        e.clientY * (window.devicePixelRatio || 1),
        -1,
      );
    };
    const mmove = (e) => {
      handleMove(
        e.clientX * (window.devicePixelRatio || 1),
        e.clientY * (window.devicePixelRatio || 1),
      );
    };
    const mup = () => {
      pointers[0].down = false;
    };
    const tstart = (e) => {
      for (let i = 0; i < e.touches.length; i++)
        handleDown(
          e.touches[i].clientX * (window.devicePixelRatio || 1),
          e.touches[i].clientY * (window.devicePixelRatio || 1),
          e.touches[i].identifier,
        );
    };
    const tmove = (e) => {
      for (let i = 0; i < e.touches.length; i++)
        handleMove(
          e.touches[i].clientX * (window.devicePixelRatio || 1),
          e.touches[i].clientY * (window.devicePixelRatio || 1),
        );
    };

    window.addEventListener("mousedown", mdown);
    window.addEventListener("mousemove", mmove);
    window.addEventListener("mouseup", mup);
    window.addEventListener("touchstart", tstart);
    window.addEventListener("touchmove", tmove);
    window.addEventListener("touchend", mup);

    requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousedown", mdown);
      window.removeEventListener("mousemove", mmove);
      window.removeEventListener("mouseup", mup);
      window.removeEventListener("touchstart", tstart);
      window.removeEventListener("touchmove", tmove);
      window.removeEventListener("touchend", mup);
    };
  }, [
    simulationResolution,
    dyeResolution,
    captureResolution,
    densityDissipation,
    velocityDissipation,
    pressure,
    pressureIterations,
    curl,
    splatRadius,
    splatForce,
    enableShading,
    colorUpdateSpeed,
    backgroundColor,
    transparent,
  ]);

  return (
    <div
      className={`fixed top-0 left-0 z-9999 pointer-events-none w-full h-full ${className}`}
    >
      <canvas
        ref={canvasRef}
        id="fluid"
        className="w-screen h-screen block opacity-50"
      ></canvas>
    </div>
  );
}
