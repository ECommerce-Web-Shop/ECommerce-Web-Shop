import Head from "next/head"
import Link from "next/dist/client/link";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer"
import Queries from "../../components/Checkout/ItemList";
import InfoUser from "../../components/Checkout/infoUser";
import { useRouter } from "next/router";
import withIronSession from "../../helpers/customWithIronSession";
import React, { useEffect, useState } from "react";
import EmptyCart from "../chua-co-don-hang/index"

export const getServerSideProps = withIronSession(async ({ req, res, params }) => {
    const jwt = req.session.get("user") ? req.session.get("user").jwt : null;
    if (!jwt) {
        res.writeHead(302, {
            Location: "/"
        });
        res.end();
    }

    return {
        props: {
        }
    }
});



const payment = () => {
    const router = useRouter();

    useEffect(() => {
        const selectedItemLength = localStorage.getItem('selectedItemLength');
        if (selectedItemLength < 1)
            router.push({
                pathname: '/gio-hang',
            })
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const mail = document.getElementById('mail').value;
        const address1 = document.getElementById('TinhThanh').value;
        const address2 = document.getElementById('QuanHuyen').value;
        const address3 = document.getElementById('address3').value;
        sessionStorage.setItem('name', name);
        sessionStorage.setItem('phone', phone);
        sessionStorage.setItem('mail', mail);
        sessionStorage.setItem('address1', address1);
        sessionStorage.setItem('address2', address2);
        sessionStorage.setItem('address3', address3);

        router.push({
            pathname: "/thanh-toan",
        })
    }

    const [cartLength, setCartLength] = useState(false);

    useEffect(() => {
        const cartLengthLocal = localStorage.getItem("cartLength");
        if (cartLengthLocal > 0)
            setCartLength(true)
    }, [])

    if (!cartLength) {
        return (
            <EmptyCart />
        )
    }
    return (
        <>
            <Head>
                <title>Thông tin giao hàng</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" key="title" />
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
                {/* <!-- Bootstrap CSS --> */}
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossOrigin="anonymous" />
                <link rel="stylesheet" href="./vendors/flickity.min.css" />
                {/* <!-- Optional CSS --> */}
                <link rel="stylesheet" href="./css/style.css" />
            </Head>
            <Header></Header>
            <nav className="breadcrumb breadcrumb--custom mb-1">
                <div className="container px-3">
                    <Link href="/">
                        <a className="breadcrumb-item">Trang chủ</a>
                    </Link>
                    <span className="breadcrumb-item active">Thanh toán</span>
                </div>
            </nav>
            <div className="payment container row mx-auto px-0">
                <div className="payment__bill col-12 col-lg-8">
                    <form className="bg-white p-3" action="/thanh-toan" method="POST" onSubmit={handleSubmit}>
                        <div className="form-group ">
                            <h2 className="title">Thông tin giao hàng</h2>
                            <InfoUser></InfoUser>
                        </div>
                        <button type="submit" className="btn btn-success w-100 my-3">
                            Tiến hành thanh toán
                        </button>
                    </form>
                </div>
                <div className="payment__product col-12 col-lg-4">
                    <div className=" bg-white p-3">
                        <h2 className="title">Chi tiết đơn hàng</h2>
                        <Queries></Queries>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default payment;