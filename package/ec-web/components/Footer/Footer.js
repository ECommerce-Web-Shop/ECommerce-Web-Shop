import React from 'react'
import Link from 'next/link'

const Footer = () => {
    return (
        <div className="footer mt-auto">
            <div className="container text-white text-left text-md-left pt-5">
                <div className="row">
                    <div className="col-md-3 mx-auto mb-4 px-3">
                        <h6 className="footer__title text-uppercase font-weight-bold">THÔNG TIN HỖ TRỢ</h6>
                        <ul className="menu menu--vertical">
                            <li>
                                <Link href="/gioi-thieu">
                                    <a className="text-white">Về chúng tôi</a>
                                </Link>
                            </li>
                            <li>
                                <Link href="/tin-tuc">
                                    <a className="text-white">Tin tức</a>
                                </Link>
                            </li>
                            <li>
                                <Link href="/dich-vu">
                                    <a className="text-white">Dịch vụ</a>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="col-md-3 mx-auto mb-4 px-3">
                        <h6 className="footer__title text-uppercase font-weight-bold">THÔNG TIN LIÊN LẠC</h6>
                        <ul className="menu menu--vertical">
                            <li>
                                <a className="text-white" href="#" title="Hotline">Hotline bán hàng:</a>
                                <a className="text-white" href="tel:0966062468">0966.06.2468</a>
                            </li>
                            <li>
                                <a className="text-white" href="tel:1900633471" title="Hotline">Hotline bảo hành, kỹ thuật: 1900.633.471</a>
                            </li>
                            <li>
                                <a className="text-white" href="tel:0962824422" title="Hotline">Hotline hỗ trợ phần mềm: 096.282.4422</a>
                            </li>
                            <li>
                                <a className="text-white" href="tel:1900633471" title="Hotline">Hotline phản ánh chất lượng dịch vụ:1900.633.471</a>
                            </li>
                        </ul>
                    </div>
                    <div className="col-md-3 mx-auto mb-4 px-3">
                        <h6 className="footer__title text-uppercase font-weight-bold">Các chi nhánh</h6>
                        <ul className="menu menu--vertical">
                            <li className="text-white">111 Trần Đăng Ninh, Cầu Giấy, Hà Nội</li>
                            <li className="text-white">446 Xã Đàn, Đống Đa, Hà Nội</li>
                            <li className="text-white">118 Thái hà, Đống Đa, Hà Nội</li>
                        </ul>
                    </div>
                    <div className="col-md-3 mx-auto mb-4 px-3">
                        <h6 className="footer__title text-uppercase font-weight-bold">Đăng ký để nhận tin mới nhất</h6>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" placeholder="Email của bạn" aria-label="Recipient's username" aria-describedby="button-addon2" />
                            <div className="input-group-append">
                                <button className="btn btn-outline-secondary" type="button" id="button-addon2">Đăng ký</button>
                            </div>
                        </div>
                        <h6 className="footer__title text-uppercase font-weight-bold">Hỗ trợ thanh toán VNPAY</h6>
                        <div className="row d-flex justify-content-between mb-3">
                            <div className="col-3 d-inline-block" id="colors">
                                <img
                                    style={{ maxWidth: "3rem" }}
                                    src="https://www.vnpayqr.vn/wp-content/uploads/2019/01/hd_03.png"
                                    alt=""
                                />
                            </div>
                            <div className="col-3 d-inline-block" id="colors">
                                <img
                                    style={{ maxWidth: "3rem" }}
                                    src="https://www.vnpayqr.vn/wp-content/uploads/2019/01/hd_05.png"
                                    alt=""
                                />
                            </div>
                            <div className="col-3 d-inline-block" id="colors">
                                <img
                                    style={{ maxWidth: "3rem" }}
                                    src="https://www.vnpayqr.vn/wp-content/uploads/2019/01/hd_07.png"
                                    alt=""
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-12 d-flex justify-content-center mb-3">
                        <i className="fab fa-instagram mr-3"></i>
                        <i className="fab fa-facebook-f mr-3"></i>
                        <i className="fab fa-google mr-3"></i>
                        <i className="fab fa-pinterest-p"></i>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer
