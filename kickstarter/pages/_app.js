import App from 'next/app';
import React from 'react';
import { readPublicConfig, setRuntimeConfig } from '../ethereum/runtimeConfig';

class CrowdCoinApp extends App {
  static async getInitialProps({ Component, ctx }) {
    const runtimeConfig = readPublicConfig();
    setRuntimeConfig(runtimeConfig);
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    return { pageProps, runtimeConfig };
  }

  render() {
    const { Component, pageProps, runtimeConfig } = this.props;
    setRuntimeConfig(runtimeConfig);
    return <Component {...pageProps} />;
  }
}

export default CrowdCoinApp;
