import React from 'react';
import { Container } from 'semantic-ui-react';
import Head from 'next/head';
import Header from './Header';

const Layout = (props) => {
    return (
        <Container>
            <Head>
                <link
                    rel="stylesheet"
                    href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.0/dist/semantic.min.css"/>
            </Head>
            <Header/>
            <style jsx global>{`
              .wallet-status {
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                gap: 0.5rem;
                max-width: 28rem;
                line-height: 1.4;
              }
              .wallet-status button {
                margin: 0;
              }
              .wallet-status a {
                color: #1a4f8b;
              }
            `}</style>
            {props.children}
        </Container>
    );
};

export default Layout;