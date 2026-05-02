import "@/styles/globals.css";
import Head from "next/head";
import SmokeyCursor from "@/components/SmokeyCursor";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Hassan Kazmi — Portfolio</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Hassan Kazmi — Backend Developer specializing in ASP.NET Core, Node.js, PostgreSQL, and MongoDB. View my portfolio, projects, and get in touch."
        />
        <meta name="author" content="Hassan Kazmi" />
        <meta
          name="keywords"
          content="Hassan Kazmi, backend developer, ASP.NET Core, Node.js, PostgreSQL, MongoDB, REST API, web developer, software engineer, javascript, typescript, database design, server-side development"
        />
        <meta name="robots" content="index, follow" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="Hassan Kazmi — Backend Developer Portfolio" />
        <meta
          property="og:description"
          content="Building scalable, high-performance backend systems with ASP.NET Core, Node.js, PostgreSQL, and MongoDB. Check out my skills, projects, and journey."
        />
        <meta property="og:site_name" content="Hassan Kazmi Portfolio" />
        <meta property="og:image" content="/profile.png" />
        <meta property="og:image:alt" content="Hassan Kazmi Portfolio Profile" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Hassan Kazmi — Backend Developer Portfolio" />
        <meta
          name="twitter:description"
          content="Building scalable, high-performance backend systems with ASP.NET Core, Node.js, PostgreSQL, and MongoDB."
        />
        <meta name="twitter:image" content="/profile.png" />

        <meta name="theme-color" content="#030014" />
      </Head>
      <SmokeyCursor />
      <Component {...pageProps} />
    </>
  );
}