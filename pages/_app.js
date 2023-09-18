// pages/_app.js

import "../styles/global.css";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  <Head>
    <link rel="shortcut icon" href="logo.png" type="image/x-icon" />
  </Head>;
  return <Component {...pageProps} />;
}

export default MyApp;
