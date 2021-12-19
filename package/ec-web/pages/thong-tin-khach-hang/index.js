import Head from "next/head";
import React, { useState, useEffect } from "react";
import { Header, Footer } from "../../components";
import { userApi } from "../../apis";
import { signOut } from "../../helpers/auth";
import { useRouter } from "next/router";
import Link from "next/link"
import { ToastContainer, toast } from 'react-toastify';
import withIronSession from '../../helpers/customWithIronSession';
import 'react-toastify/dist/ReactToastify.css';


export const getServerSideProps = withIronSession(async ({ req, res, params }) => {
    const jwt = req.session.get("user") ? req.session.get("user").jwt : null;
    if (!jwt) {
        res.writeHead(302, {
            Location: "/",
        });
        res.end();
    }
    return {
        props: {
            isSignedIn: jwt
        },
    };
});


export default function Customer({isSignedIn}) {
    const router = useRouter();
    const [userInfo, setUserInfo] = useState({});
    const [userOrder, setUserOrder] = useState([]);
    useEffect(async () => {
        const {
            data: { me: user },
        } = await userApi.me();
        const {
            data: { orders },
        } = await userApi.getUserOrders();
        console.log(orders);

        for (var i = 0; i < orders.length; i++) {
            switch (orders[i].status) {
                case "Pending":
                    orders[i].status = "Đang sử lý"
                    break;
                case "Confirmed":
                    orders[i].status = "Đã xác nhận đơn"
                    break;
                case "Delivery":
                    orders[i].status = "Đang giao"
                    break;
                case "Delivered":
                    orders[i].status = "Đã giao"
                    break;
                case "Cancelled":
                    orders[i].status = "Đã hủy"
                    break;
                default:
                    orders[i].status = "Status"
            }
            orders[i].addressLine1 = orders[i].addressLine1 + " " + orders[i].district + " " + orders[i].city
            orders[i].finalAmount = orders[i].finalAmount.toLocaleString("DE-de");
        }
        console.log(orders);
        setUserInfo(user);
        setUserOrder(orders);
    }, []);

    const Address = (props) => (
        <div>
            <label htmlFor="address">{props.address}</label>
            <input
                className="input-address__radio"
                type="radio"
                id="address"
                name="address"
            />
            <span className="delete-address">
                <a href="">Xóa</a>
            </span>
            <br />
        </div>
    );

    const OrderProduct = (props) => (
        <tr className="control-show__order">
            <td>
                <Link href="/order-detail/[id]" as={`/order-detail/${props.id}`} className="text-dark">
                    {props.maDonHang}
                </Link>
            </td>
            <td>{props.diaChiGiaoHang}</td>
            <td className="order-moble">{props.giaSanPham} ₫</td>
            <td className="order-moble">{props.trangThaiDonHang}</td>
        </tr>
    );
    // Handle sign out from user
    const handleSignOut = async () => {
        if (await signOut()) {
            router.push("/");
            localStorage.clear();
        }
    }

    const Order = () =>
        userOrder.map((order) => (
            <OrderProduct
                id={order.id}
                maDonHang={order.orderCode}
                diaChiGiaoHang={order.addressLine1}
                giaSanPham={order.finalAmount}
                trangThaiDonHang={order.status}
            />
        ));
    const notifyNotMatchPwd = () => toast.warn('Mật khẩu bạn nhập không khớp nhau', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });

    const notifyChangePwdFailure = () => toast.error('Có lỗi xảy ra trong quá trình thay đổi mật khẩu', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });

    const notifyChangePwdSuccessfully = () => toast.success('Thay đổi mật khẩu mới thành công', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });

    const handleChangePassword = async e => {
        const currentPwd = document.getElementById('current-password').value;
        const newPwd = document.getElementById('new-password').value;
        const confirmedPwd = document.getElementById('confirmed-password').value;

        if (newPwd !== confirmedPwd)
            return notifyNotMatchPwd();

        const {
            data,
            errors
        } = await userApi.changePassword(currentPwd, newPwd, confirmedPwd);

        return !errors ? data.changePassword : false;
    };

    const handleSubmitUpdateProfile = async e => {
        e.preventDefault();
        const btn = e.target;
        const wantToChangePwd = document.getElementById('change-password').checked;

        btn.setAttribute("disabled", true);
        btn.innerHTML = `
                <span class="spinner-border spinner-border-sm"></span>
                Đang gửi... 
            `;

        if (wantToChangePwd) {
            const changedPassword = await handleChangePassword();

            // If new passwords is not match, handleChangePassword will notify and return an string
            if (typeof changedPassword !== 'string') {
                const notify = changedPassword ? notifyChangePwdSuccessfully : notifyChangePwdFailure;
                notify();
                document.getElementById('current-password').value = '';
                document.getElementById('new-password').value = '';
                document.getElementById('confirmed-password').value = '';
            }
        }

        btn.removeAttribute("disabled");
        btn.innerHTML = "Cập nhật";
    };

    useEffect(() => {
        function customerToggle() {
            const account = document.getElementById("show-account");
            const order = document.getElementById("show-order");
            const changePasswordShow = document.getElementById(
                "change-password__show"
            );
            const changePassword = document.querySelector(
                "input[name=change-password]"
            );

            account.style.display = "block";
            order.style.display = "none";
            changePasswordShow.style.display = "none";

            document
                .getElementById("account-event")
                .addEventListener("click", function () {
                    account.style.display = "block";
                    order.style.display = "none";
                });
            document
                .getElementById("order-event")
                .addEventListener("click", function () {
                    account.style.display = "none";
                    order.style.display = "block";
                });
            changePassword.addEventListener("change", function () {
                if (this.checked) {
                    changePasswordShow.style.display = "flex";
                } else {
                    changePasswordShow.style.display = "none";
                }
            });
        }
        customerToggle();
    });

    useEffect(() => {
        if(!isSignedIn) 
            router.push('/');
    });

    const Customer = () => (
        <div>
            <div
                className="container-fluid"
                style={{ backgroundColor: "#f0f0f0" }}
            >
                <div className="container py-4">
                    <div className="row manage-resposive">
                        <div className="col-sm-3 col-md-3 col-lg-3 col-xl-3">
                            <div
                                className="row"
                                style={{ paddingLeft: "15px", width: "300px" }}
                            >
                                <div className="account">
                                    <img
                                        className="account__img"
                                        src="./img/avatar-user.png"
                                        alt="avatar-user"
                                    />
                                    <div className="account__info">
                                        Tài khoản của
                                        <strong>{userInfo.username}</strong>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-2">
                                <ul className="list-group">
                                    <li
                                        className="list-group-item list-group-item__edit"
                                        id="account-event"
                                    >
                                        <a className="account-list-info">
                                            <i className="fas account-list-info__icon fa-user-circle"></i>
                                            <span>Thông tin tài khoản</span>
                                        </a>
                                    </li>
                                    <li
                                        className="list-group-item list-group-item__edit"
                                        id="order-event"
                                    >
                                        <a className="account-list-info">
                                            <i className="fas account-list-info__icon fa-th-list"></i>
                                            <span>Quản lý đơn hàng</span>
                                        </a>
                                    </li>
                                    <li className="list-group-item list-group-item__edit" onClick={handleSignOut}>
                                        <a className="account-list-info wish-list-event">
                                            <i
                                                className="fas account-list-info__icon fa-sign-out-alt"
                                                aria-hidden="true"
                                            />
                                            <span>Đăng xuất</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div
                            className="col-sm-9 col-md-9 col-lg-9 col-xl-9 account-detail"
                            id="show-account"
                        >
                            <div className="">
                                <h2 className="account-detail__title">
                                    Thông tin tài khoản
                                </h2>
                            </div>
                            <div className="shadow">
                                <form className="account-detail__form">
                                    <div className="form-group row account-form-edit container">
                                        <label
                                            htmlFor="name"
                                            className="col-sm-2 col-form-label"
                                        >
                                            Tên người dùng
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control col-sm-10"
                                            id="name"
                                            value={userInfo.username}
                                            disabled
                                        />
                                    </div>
                                    <div className="form-group row account-form-edit container">
                                        <label
                                            htmlFor="name"
                                            className="col-sm-2 col-form-label"
                                        >
                                            Họ tên
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control col-sm-10"
                                            id="name"
                                            defaultValue={userInfo.name}
                                            disabled
                                        />
                                    </div>
                                    <div className="form-group row account-form-edit container">
                                        <label
                                            htmlFor="phone"
                                            className="col-sm-2 col-form-label"
                                        >
                                            Số điện thoại
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control col-sm-10"
                                            id="phone"
                                            defaultValue={userInfo.phone}
                                            disabled
                                        />
                                    </div>
                                    <div className="form-group row account-form-edit container">
                                        <label
                                            htmlFor="email"
                                            className="col-sm-2  col-form-label"
                                        >
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control col-sm-10"
                                            id="email"
                                            defaultValue={userInfo.email}
                                            disabled
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-sm-2"></div>
                                        <div className="col-sm-10">
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="change-password"
                                                    name="change-password"
                                                />
                                                <label
                                                    className="form-check-label"
                                                    htmlFor="change-password"
                                                >
                                                    Thay đổi mật khẩu
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="form-group account-form-edit row container"
                                        id="change-password__show"
                                    >
                                        <label
                                            htmlFor="current-password"
                                            className="col-sm-2 col-form-label"
                                        >
                                            Mật khẩu hiện tại
                                        </label>
                                        <div className="col-sm-10 px-0">
                                            <input
                                                type="password"
                                                className="form-control w-100"
                                                id="current-password"
                                                placeholder="Nhập mật khẩu hiện tại"
                                            />
                                            <span
                                                toggle="#current-password"
                                                className="fas fa-fw fa-eye fa-sm text-secondary field-icon toggle-password"
                                                onClick={e => {
                                                    $(e.target).toggleClass("fa-eye fa-eye-slash");
                                                    var input = $($(e.target).attr("toggle"));
                                                    if (input.attr("type") == "password") {
                                                        input.attr("type", "text");
                                                    } else {
                                                        input.attr("type", "password");
                                                    }
                                                }}
                                            ></span>
                                        </div>
                                        <label
                                            htmlFor="new-password"
                                            className="col-sm-2 col-form-label"
                                        >
                                            Mật khẩu mới
                                        </label>
                                        <div className="col-sm-10 px-0">
                                            <input
                                                type="password"
                                                className="form-control w-100"
                                                id="new-password"
                                                placeholder="Nhập mật khẩu mới"
                                            />
                                            <span
                                                toggle="#new-password"
                                                className="fas fa-fw fa-eye fa-sm text-secondary field-icon toggle-password"
                                                onClick={e => {
                                                    $(e.target).toggleClass("fa-eye fa-eye-slash");
                                                    var input = $($(e.target).attr("toggle"));
                                                    if (input.attr("type") == "password") {
                                                        input.attr("type", "text");
                                                    } else {
                                                        input.attr("type", "password");
                                                    }
                                                }}
                                            ></span>
                                        </div>
                                        <label
                                            htmlFor="confirmed-password"
                                            className="col-sm-2 col-form-label"
                                        >
                                            Xác nhận mật khẩu mới
                                        </label>
                                        <div className="col-sm-10 px-0">
                                            <input
                                                type="password"
                                                className="form-control w-100"
                                                id="confirmed-password"
                                                placeholder="Nhập lại mật khẩu mới"
                                            />
                                            <span
                                                toggle="#confirmed-password"
                                                className="fas fa-fw fa-eye fa-sm text-secondary field-icon toggle-password"
                                                onClick={e => {
                                                    $(e.target).toggleClass("fa-eye fa-eye-slash");
                                                    var input = $($(e.target).attr("toggle"));
                                                    if (input.attr("type") == "password") {
                                                        input.attr("type", "text");
                                                    } else {
                                                        input.attr("type", "password");
                                                    }
                                                }}
                                            ></span>
                                        </div>
                                        <div className="form-group w-100 d-flex justify-content-center">
                                            <button
                                                type="submit"
                                                className="btn btn-primary"
                                                onClick={handleSubmitUpdateProfile}
                                            >
                                                Cập nhật
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div
                            className="col-sm-9 col-md-9 col-lg-9 col-xl-9 info-your-order"
                            id="show-order"
                            style={{ backgroundColor: "#f0f0f0" }}
                        >
                            <div className="">
                                <h2 className="account-detail__title ">
                                    Đơn hàng của bạn
                                </h2>
                            </div>
                            <div
                                className="manage-order shadow"
                                style={{
                                    backgroundColor: "#fff",
                                    padding: "20px",
                                }}
                            >
                                <table style={{ width: "100%" }}>
                                    <thead>
                                        <tr className="control-show__order">
                                            <th>Mã đơn hàng</th>
                                            <th
                                                column="4"
                                                className="order-moble"
                                            >
                                                Địa chỉ giao hàng
                                            </th>
                                            <th className="order-moble">
                                                Tổng tiền
                                            </th>
                                            <th className="order-moble">
                                                Trạng thái đơn hàng
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <Order />
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div>
            <div id="root">
                <Head>
                    <title>Thông tin tài khoản</title>
                    <link rel="stylesheet" href="./css/customer-info.css" />
                </Head>
                <Header />
                <Customer />
                <ToastContainer />
                <Footer />
            </div>
        </div>
    );
}
