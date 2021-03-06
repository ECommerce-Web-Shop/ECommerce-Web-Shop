import React, { useState, useEffect } from "react";
import { Header, Footer, Banner } from "../../components";
import Head from "next/head";
import ItemList from "../../components/Checkout/ItemList";
import withIronSession from "../../helpers/customWithIronSession";
import { useRouter } from "next/router";
import EmptyCart from "../chua-co-don-hang/index";
import { orderApi } from "../../apis";
import { vnPay } from "../../apis";

export const getServerSideProps = withIronSession(async ({ req, res, params }) => {
    const jwt = req.session.get("user") ? req.session.get("user").jwt : null;
    if (!jwt) {
        res.writeHead(302, {
            Location: "/dang-nhap",
        });
        res.end();
    }
    return {
        props: {},
    };
});

export default function Login() {
    const router = useRouter();

    useEffect(() => {
        const selectedItemLength = localStorage.getItem("selectedItemLength");
        if (selectedItemLength < 1)
            router.push({
                pathname: "/gio-hang",
            });
    }, []);

    useEffect(() => {
        const name = sessionStorage.getItem("name");
        const phone = sessionStorage.getItem("phone");
        const mail = sessionStorage.getItem("mail");
        const address1 = sessionStorage.getItem("address1");
        const address2 = sessionStorage.getItem("address2");
        const address3 = sessionStorage.getItem("address3");
        if (!name || !phone || !mail || !address1 || !address2 || !address3) {
            router.push("/thong-tin-giao-hang");
        }
    }, []);

    const [cartLength, setCartLength] = useState(false);

    useEffect(() => {
        const cartLengthSession = sessionStorage.getItem("cartLength");
        if (cartLengthSession > 0) setCartLength(true);

        const day = new Date();
        const amount = sessionStorage.getItem("finalAmount");
        document.getElementById("orderDescription").value = day;
        document.getElementById("amount").value = amount;
    }, []);

    if (cartLength === 0) {
        return <EmptyCart />;
    }

    const handleSubmit = () => {
        const name = sessionStorage.getItem("name");
        const phone = sessionStorage.getItem("phone");
        const mail = sessionStorage.getItem("mail");
        const address1 = sessionStorage.getItem("address1");
        const address2 = sessionStorage.getItem("address2");
        const address3 = sessionStorage.getItem("address3");
        // const
        const data = orderApi.checkout(
            name,
            phone,
            mail,
            address3,
            address2,
            address1,
            "COD"
        );
        if (data) router.push("/thanh-toan/thanh-cong");
        console.log(data);
    };
    const onSubmit = () => {
        const name = sessionStorage.getItem("name");
        const phone = sessionStorage.getItem("phone");
        const mail = sessionStorage.getItem("mail");
        const address1 = sessionStorage.getItem("address1");
        const address2 = sessionStorage.getItem("address2");
        const address3 = sessionStorage.getItem("address3");
        orderApi.checkout(name, phone, mail, address3, address2, address1, "VnPay");
        const orderDescription = document.getElementById("orderDescription").value;
        const amount = parseInt(document.getElementById("amount").value);
        const bankCode = document.getElementById("bankCode").value;
        const transactionRef = "110001";
        

        const payUrl = vnPay.GerUrl(
            amount,
            bankCode,
            orderDescription,
            transactionRef
        );
        router.replace(payUrl);
    };

    return (
        <>
            <Head>
                <title>Thanh to??n</title>
            </Head>
            <Header></Header>
            <Banner></Banner>

            <div className="payment container row mx-auto px-0">
                <div className="payment__bill col-12 col-lg-8">
                    <div className="bg-white p-3">
                        <div className="form-group w-100">
                            <b>
                                <h2 className="title">Ph????ng th???c thanh to??n</h2>
                            </b>
                            <div className="row m-3">
                                <div className="col-12 accordion" id="thanhtoan">
                                    <div className="card text-dark">
                                        <div className="card-header" id="headingDirect">
                                            <button
                                                className="btn btn-link btn-block text-left"
                                                data-toggle="collapse"
                                                data-target="#collapseDirect"
                                                aria-expanded="false"
                                                aria-controls="collapseDirect"
                                            >
                                                <label>
                                                    <input
                                                        type="radio"
                                                        name="phuongThuc"
                                                        id
                                                        defaultValue
                                                        className="mr-3"
                                                        checked
                                                    />
                                                    Thanh to??n khi nh???n h??ng (COD)
                                                </label>
                                            </button>
                                        </div>
                                        <div
                                            id="collapseDirect"
                                            className="collapse show"
                                            aria-labelledby="headingDirect"
                                            data-parent="#thanhtoan"
                                        >
                                            <div className="card-body mx-auto">
                                                <h5 className="text-danger">
                                                    C???a h??ng th???c hi???n ch????ng tr??nh mi???n ph?? v???n chuy???n
                                                    cho ????n h??ng tr??n 5 tri???u ?????ng!
                                                </h5>
                                                <p>
                                                    V???i ph????ng th???c thanh to??n n??y, qu?? kh??ch tr??? ti???n m???t
                                                    cho nh??n vi??n giao h??ng ngay khi nh???n ???????c ????n h??ng
                                                    c???a m??nh. Ch??ng t??i ch???p nh???n h??nh th???c thanh to??n khi
                                                    nh???n h??ng (COD) cho h???u h???t ????n h??ng tr??n to??n qu???c.
                                                </p>

                                                <button
                                                    type="button"
                                                    className="btn btn-success w-100 my-3"
                                                    onClick={handleSubmit}
                                                >
                                                    X??c nh???n ????n h??ng
                                                </button></div>
                                        </div>
                                    </div>
                                    <div className="card text-dark border">
                                        <div className="card-header" id="headingVnpay">
                                            <button
                                                className="btn btn-link btn-block text-left"
                                                data-toggle="collapse"
                                                data-target="#collapseVnpay"
                                                aria-expanded="false"
                                                aria-controls="collapseVnpay"
                                            >
                                                <label>
                                                    <input
                                                        type="radio"
                                                        name="phuongThuc"
                                                        id
                                                        className="mr-3"
                                                    />
                                                    <span>V?? ??i???n t??? VNPAY</span>
                                                </label>
                                            </button>
                                        </div>
                                        <div
                                            id="collapseVnpay"
                                            className="collapse"
                                            aria-labelledby="headingVnpay"
                                            data-parent="#thanhtoan"
                                        >
                                            <div className="card-body mx-auto">
                                                <div>
                                                    <div className="formItem py-3">
                                                        <label htmlFor="">Lo???i h??ng h??a</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name="orderType"
                                                            id="orderType"
                                                            required
                                                            defaultValue=""
                                                            value="??i???n tho???i"
                                                            placeholder="??i???n tho???i"
                                                            disabled
                                                        />
                                                    </div>
                                                    <div className="formItem py-3">
                                                        <label htmlFor="">S??? ti???n</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name="amount"
                                                            id="amount"
                                                            required
                                                            defaultValue=""
                                                            placeholder="S??? ti???n"
                                                            disabled
                                                        />
                                                    </div>
                                                    <div className="formItem py-3">
                                                        <label htmlFor="">N???i dung thanh to??n</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name="orderDescription"
                                                            id="orderDescription"
                                                            required
                                                            defaultValue=""
                                                            placeholder="N???i dung thanh to??n"
                                                        />
                                                    </div>
                                                    <div className="formItem py-3">
                                                        <label htmlFor="">Ng??n h??ng</label>
                                                        <select
                                                            className="form-control"
                                                            name="bankCode"
                                                            id="bankCode"
                                                            required
                                                            defaultValue=""
                                                        >
                                                            <option value="">Kh??ng ch???n</option>
                                                            <option value="VNPAYQR">Ng??n h??ng VNPAYQR</option>
                                                            <option value="NCB">Ng??n h??ng NCB</option>
                                                            <option value="SCB">Ng??n h??ng SCB</option>
                                                            <option value="SACOMBANK">
                                                                Ng??n h??ng SACOMBANK
                                                            </option>
                                                            <option value="EXIMBANK">
                                                                Ng??n h??ng EXIMBANK
                                                            </option>
                                                            <option value="MSBANK">Ng??n h??ng MSBANK</option>
                                                            <option value="NAMABANK">
                                                                Ng??n h??ng NAMABANK
                                                            </option>
                                                            <option value="VISA">Ng??n h??ng VISA</option>
                                                            <option value="VNMART">Ng??n h??ng VNMART</option>
                                                            <option value="VIETINBANK">
                                                                Ng??n h??ng VIETINBANK
                                                            </option>
                                                            <option value="VIETCOMBANK">
                                                                Ng??n h??ng VIETCOMBANK
                                                            </option>
                                                            <option value="HDBANK">Ng??n h??ng HDBANK</option>
                                                            <option value="DONGABANK">
                                                                Ng??n h??ng DONGABANK
                                                            </option>
                                                            <option value="TPBANK">Ng??n h??ng TPBANK</option>
                                                            <option value="OJB">Ng??n h??ng OJB</option>
                                                            <option value="BIDV">Ng??n h??ng BIDV</option>
                                                            <option value="TECHCOMBANK">
                                                                Ng??n h??ng TECHCOMBANK
                                                            </option>
                                                            <option value="VPBANK">Ng??n h??ng VPBANK</option>
                                                            <option value="AGRIBANK">
                                                                Ng??n h??ng AGRIBANK
                                                            </option>
                                                            <option value="MBBANK">Ng??n h??ng MBBANK</option>
                                                            <option value="ACB">Ng??n h??ng ACB</option>
                                                            <option value="OCB">Ng??n h??ng OCB</option>
                                                            <option value="SHB">Ng??n h??ng SHB</option>
                                                            <option value="IVB">Ng??n h??ng IVB</option>
                                                        </select>
                                                    </div>
                                                    <button
                                                        className="btn btn-success w-100 my-3"
                                                        onClick={onSubmit}
                                                    >
                                                        Thanh to??n Reirect
                                                    </button>
                                                </div>
                                                {/* ============================ */}
                                                <h4 className="text-center text-success">
                                                    H?????ng d???n thanh to??n b???ng VNPAY
                                                </h4>
                                                <ol className="container">
                                                    <li className="my-2">
                                                        ????ng nh???p v??o ???ng d???ng Mobile Banking m?? b???n mu???n
                                                        thanh to??n
                                                    </li>
                                                    <li className="my-2">
                                                        <p>
                                                            Ch???n m???c <b>Qu??t m?? QR / Scan QR Code</b>
                                                        </p>
                                                        <img
                                                            src="./img/QRCode.png"
                                                            className=""
                                                            alt="qr-code"
                                                            style={{ maxWidth: "230px" }}
                                                        />
                                                    </li>
                                                    <li className="my-2">
                                                        <p>Scan m?? QR ph??a tr??n ????? thanh to??n.</p>
                                                    </li>
                                                </ol>
                                                {/* =============================== */}
                                                <h4 className="text-center text-success mt-5">
                                                    ???ng d???ng Mobile Banking h??? tr??? VNPAY
                                                </h4>
                                                <div className="col-3 d-inline-block" id="colors">
                                                    <img
                                                        style={{ maxWidth: "8rem" }}
                                                        src="https://www.vnpayqr.vn/wp-content/uploads/2019/01/hd_03.png"
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="col-3 d-inline-block" id="colors">
                                                    <img
                                                        style={{ maxWidth: "8rem" }}
                                                        src="https://www.vnpayqr.vn/wp-content/uploads/2019/01/hd_05.png"
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="col-3 d-inline-block" id="colors">
                                                    <img
                                                        style={{ maxWidth: "8rem" }}
                                                        src="https://www.vnpayqr.vn/wp-content/uploads/2019/01/hd_07.png"
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="col-3 d-inline-block" id="colors">
                                                    <img
                                                        style={{ maxWidth: "8rem" }}
                                                        src="https://www.vnpayqr.vn/wp-content/uploads/2019/01/hd_09.png"
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="col-3 d-inline-block" id="colors">
                                                    <img
                                                        style={{ maxWidth: "8rem" }}
                                                        src="https://www.vnpayqr.vn/wp-content/uploads/2019/06/Screenshot_39.png"
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="col-3 d-inline-block" id="colors">
                                                    <img
                                                        style={{ maxWidth: "8rem" }}
                                                        src="https://www.vnpayqr.vn/wp-content/uploads/2019/06/IVB.png"
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="col-3 d-inline-block" id="colors">
                                                    <img
                                                        style={{ maxWidth: "8rem" }}
                                                        src="https://www.vnpayqr.vn/wp-content/uploads/2019/01/hd_25.png"
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="col-3 d-inline-block" id="colors">
                                                    <img
                                                        style={{ maxWidth: "8rem" }}
                                                        src="https://www.vnpayqr.vn/wp-content/uploads/2019/01/hd_26.png"
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="col-3 d-inline-block" id="colors">
                                                    <img
                                                        style={{ maxWidth: "8rem" }}
                                                        src="https://www.vnpayqr.vn/wp-content/uploads/2019/04/HDBANK.jpg"
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="col-3 d-inline-block" id="colors">
                                                    <img
                                                        style={{ maxWidth: "8rem" }}
                                                        src="https://www.vnpayqr.vn/wp-content/uploads/2019/06/sacom-01.png"
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="col-3 d-inline-block" id="colors">
                                                    <img
                                                        style={{ maxWidth: "8rem" }}
                                                        src="https://www.vnpayqr.vn/wp-content/uploads/2019/06/6.-Nam-%C3%81-01.jpg"
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="col-3 d-inline-block" id="colors">
                                                    <img
                                                        style={{ maxWidth: "8rem" }}
                                                        src="https://www.vnpayqr.vn/wp-content/uploads/2019/07/vietbank-200x140.jpg"
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="col-3 d-inline-block" id="colors">
                                                    <img
                                                        style={{ maxWidth: "8rem" }}
                                                        src="https://www.vnpayqr.vn/wp-content/uploads/2019/08/Logo.png"
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="col-3 d-inline-block" id="colors">
                                                    <img
                                                        style={{ maxWidth: "8rem" }}
                                                        src="https://www.vnpayqr.vn/wp-content/uploads/2020/04/kienbanhlogo.png"
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="col-3 d-inline-block" id="colors">
                                                    <img
                                                        style={{ maxWidth: "8rem" }}
                                                        src="https://www.vnpayqr.vn/wp-content/uploads/2019/01/hd_37.png"
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="col-3 d-inline-block" id="colors">
                                                    <img
                                                        style={{ maxWidth: "8rem" }}
                                                        src="https://www.vnpayqr.vn/wp-content/uploads/2019/06/logo_mbbank.jpg"
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="col-3 d-inline-block" id="colors">
                                                    <img
                                                        style={{ maxWidth: "8rem" }}
                                                        src="https://www.vnpayqr.vn/wp-content/uploads/2019/01/hd_33.png"
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="col-3 d-inline-block" id="colors">
                                                    <img
                                                        style={{ maxWidth: "8rem" }}
                                                        src="https://www.vnpayqr.vn/wp-content/uploads/2020/01/ocean-test-1.png"
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="col-3 d-inline-block" id="colors">
                                                    <img
                                                        style={{ maxWidth: "8rem" }}
                                                        src="https://vnpayqr.vn/wp-content/uploads/2019/01/hd_13.png"
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="col-3 d-inline-block" id="colors">
                                                    <img
                                                        style={{ maxWidth: "8rem" }}
                                                        src="https://vnpayqr.vn/wp-content/uploads/2019/06/MSB-1.jpg"
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="col-3 d-inline-block" id="colors">
                                                    <img
                                                        style={{ maxWidth: "8rem" }}
                                                        src="https://vnpayqr.vn/wp-content/uploads/2019/01/hd_35.png"
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="col-3 d-inline-block" id="colors">
                                                    <img
                                                        style={{ maxWidth: "8rem" }}
                                                        src="https://vnpayqr.vn/wp-content/uploads/2019/11/viet-a-bank.png"
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="col-3 d-inline-block" id="colors">
                                                    <img
                                                        style={{ maxWidth: "8rem" }}
                                                        src="https://vnpayqr.vn/wp-content/uploads/2019/08/shinhan-logo-1.jpg"
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="col-3 d-inline-block" id="colors">
                                                    <img
                                                        style={{ maxWidth: "8rem" }}
                                                        src="https://vnpayqr.vn/wp-content/uploads/2019/07/logo-viviet-1.png"
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="col-3 d-inline-block" id="colors">
                                                    <img
                                                        style={{ maxWidth: "8rem" }}
                                                        src="https://vnpayqr.vn/wp-content/uploads/2019/10/pvcombank.png"
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="col-3 d-inline-block" id="colors">
                                                    <img
                                                        style={{ maxWidth: "8rem" }}
                                                        src="https://vnpayqr.vn/wp-content/uploads/2019/01/hd_22.png"
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="col-3 d-inline-block" id="colors">
                                                    <img
                                                        style={{ maxWidth: "8rem" }}
                                                        src="https://vnpayqr.vn/wp-content/uploads/2019/06/nhdpocb.png"
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="col-3 d-inline-block" id="colors">
                                                    <img
                                                        style={{ maxWidth: "8rem" }}
                                                        src="https://vnpayqr.vn/wp-content/uploads/2019/04/ACB_Logo-1.png"
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="col-3 d-inline-block" id="colors">
                                                    <img
                                                        style={{ maxWidth: "8rem" }}
                                                        src="https://vnpayqr.vn/wp-content/uploads/2019/06/466x330.jpg"
                                                        alt=""
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="payment__product col-12 col-lg-4">
                    <div className=" bg-white p-3">
                        <h2 className="title">Chi ti???t ????n h??ng</h2>
                        <ItemList></ItemList>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </>
    );
}
