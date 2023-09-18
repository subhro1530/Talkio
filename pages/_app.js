// pages/_app.js

import "../styles/global.css";
import Head from "next/head";
import Link from "next/link";

function MyApp({ Component, pageProps }) {
  <Head>
    <title>TalkIO-A Messenger</title>
    <Link rel="shortcut icon" href="/logo.png" type="image/x-icon" />
  </Head>;
  return <Component {...pageProps} />;
}

export default MyApp;
