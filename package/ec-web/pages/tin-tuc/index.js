import React from 'react'
import Head from 'next/head';

import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer'
import New from '../../components/New/New';

const index = () => {
    return (
        <>
            <Head>
                <title>Tin Tức</title>
                <link rel="stylesheet" href="./vendors/flickity.min.css"></link>
                <link rel="stylesheet" href="./css/news.css"/>
                <link rel="stylesheet" href="./css/grid.css"/>
            </Head>
            <Header/>
            <New/>
            <Footer/>         
            <script src="./vendors/flickity.pkgd.min.js"></script>
            <script src="./js/main.js"></script>
            <script src="./js/news.js"></script>
        </>
    )
}

export default index
