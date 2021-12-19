import React from 'react'
import Head from 'next/head';
import { Header, Footer } from "../../components";
import About from "../../components/About/About"

const intro = () => {
    return (
        <>
            <Head>
                <title>Về Chúng Tôi</title>
                <link rel="stylesheet" href="./css/about.css"/>
            </Head>
            <Header/>
            <About/>
            <Footer/>        
        </>
    )
}

export default intro;
