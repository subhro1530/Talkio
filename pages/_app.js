// pages/_app.js

import "../styles/global.css";

function MyApp({ Component, pageProps }) {
  <head>
    <link rel="shortcut icon" href="/logo.png" type="image/x-icon" />
  </head>;
  return <Component {...pageProps} />;
}

export default MyApp;
