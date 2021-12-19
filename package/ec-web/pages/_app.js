import React, { useState } from "react";
import Router from "next/router";
import Head from "next/head";

export default function App({ Component, pageProps }) {
    const [loading, setLoading] = useState(false);
    Router.events.on("routeChangeStart", url => {
        setLoading(true);
    });
    Router.events.on("routeChangeComplete", url => {
        setLoading(false);
    });
    return (
        <>
            <Head>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <Component {...pageProps} />
            {/* <!-- Page Preloder --> */}
            { loading ? (
                <div id="preloder">
                    <div className="loader"></div>
                </div>
            ) : ""}
        </>
    )
}
