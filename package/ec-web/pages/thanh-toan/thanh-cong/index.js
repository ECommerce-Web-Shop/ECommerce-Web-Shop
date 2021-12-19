import React, { useState } from "react";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";

// export async function getServerSideProps(ctx) {
//     nookies.destroy(ctx, 'jwt')

//     return { props: {} };
// }

export default function Login() {

    useEffect(() => {
        const selectedItemLength = localStorage.getItem('selectedItemLength');
        if (selectedItemLength < 1)
            router.push({
                pathname: '/gio-hang',
            })
    }, [])

    return (
        <>
            <Head>
                <title>Đặt hàng thành công</title>
            </Head>
            <Header></Header>
            {/* <Banner /> */}
            <div className="text-center text-successful my-4">
                <div className="container d-inline-block border shadow p-3" style={{ backgroundColor: "#F7F7F7", borderRadius: "20px" }}>
                    <img
                        src="https://www.pngitem.com/pimgs/m/479-4796343_free-shipping-png-fast-shipping-icon-png-transparent.png"
                        style={{ maxWidth: "300px" }}
                    />
                    <h3 className="text-success">Thanh toán thành công!</h3>
                    <p>Đơn hàng của quý khách đã được thanh toán thành công. DeveraShop sẽ sớm liên hệ với quý khách để bàn giao sản phẩm.</p>
                    <Link href="/">
                        <button className="btn btn-primary w-100 text-white" role="button" type="button">
                            Trở về trang chủ
                        </button>
                    </Link>
                </div> 
            </div>
            <Footer></Footer>
        </>
    );
}
