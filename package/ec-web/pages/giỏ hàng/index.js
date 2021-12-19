import React, {useState, useEffect} from "react";
import Head from "next/head";
import Link from "next/link";
import { cartApi } from '../../apis';
import { Header, Footer, Modal, CartItem } from '../../components';
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CartPage() {
    const [items, setItems] = useState([]);
    const [coupon, setCoupon] = useState({});
    const [enableMutilRemove, setEnableMutilRemove] = useState(false);
    const [amount, setAmount] = useState({
        totalAmount: 0,
        finalAmount: 0,
    });
    const [someOutOfStock, setSomeOutOfStock] = useState(false);
    const route = useRouter();

    useEffect(() => {
        fetchCart();
    }, []);

    useEffect(() => {
        const selectedItems = items.filter(item => {
            if(item)
            return item.selected;
        });

        document.getElementById("customCheckAll").checked = (selectedItems.length === items.length && items.length > 0);
        setEnableMutilRemove(selectedItems.length > 0)

    },[items]);

    const setNewCart = (newCart) => {
        localStorage.setItem("cartId", newCart._id);
        setItems([]);
        setAmount({
            totalAmount: newCart.totalAmount,
            finalAmount: newCart.finalAmount,
        });
        setCoupon({
            code: (newCart.coupon) ? newCart.coupon.code : null,
            couponIsValid: newCart.couponIsValid
        });
        setItems(newCart.items);
    }

    const fetchCart = async () => {
        try {
            const { data: { cart } } = await cartApi.getCart(localStorage.getItem("cartId"));
            setNewCart(cart);
        } 
        catch(error) {
            console.log(error);
        }
    };  

    const toggleSelectAll = async e => {
        const value = e.target.checked;

        try {
            const { data } = await cartApi.toggleSelectAllItems(localStorage.getItem("cartId"), value);

            setNewCart(data.cart);

            const selects = document.querySelectorAll(".custom-checkbox input[type=checkbox]");
            for(let i = 0; i <= selects.length; i++) {
                selects[i].checked = value;
            }

        } catch(error) {
            console.log(error);
        }
    }

    const removeSelectedItems = async () => {
        try {
            const { data: { cart } } = await cartApi.removeSelectedItems(localStorage.getItem('cartId'));
            setNewCart(cart);
        } catch(error) {
            console.log(error);
        }
    };

    const confirmRemoveItems = () => {
        $(`#removeMutilConfirm`).modal();
    }            

    const applyCoupon = async () => {
        const couponCode = document.getElementById('couponInput').value;
        try {
            const { data: { cart } } = await cartApi.applyCoupon(localStorage.getItem('cartId'), couponCode);
            setNewCart(cart);
        } catch(error) {
            setCoupon({
                wrong: true
            });
        } 
    }

    const removeCoupon = async () => {
        const { data: { cart }, errors } = await cartApi.removeCoupon(localStorage.getItem('cartId'));
        !errors && setNewCart(cart);
    }

    const clickPay = async e =>{
        const btn = e.target;
        const selectedItemLength = localStorage.getItem('selectedItemLength');

        btn.setAttribute("disabled", true);
        btn.innerHTML = `
            <span class="spinner-border spinner-border-sm"></span>
        `;

        await fetchCart();

        if(someOutOfStock)
            toast.warn(`Số lượng sản phẩm trong kho không đủ để thực hiện đơn hàng`, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        else if (selectedItemLength < 1)
            toast.warn(`Hiện bạn chưa chọn sản phẩm nào để mua`, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });  
        else 
            route.push('/thong-tin-giao-hang');

        
        btn.removeAttribute("disabled");
        btn.innerHTML = "Thanh toán";
  };
  
    return (
        <>
            <Head>
                <title>Giỏ hàng</title>
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
            </Head>
            <Header />
            {/* <Cart/> */}
            <nav className="breadcrumb breadcrumb--custom pb-1">
                <div className="container">
                    <a className="breadcrumb-item" href="/">
                        Trang chủ
                    </a>
                    <span className="breadcrumb-item active">Giỏ hàng</span>
                </div>
            </nav>
            <ToastContainer
              position="top-center"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
            <div style={{backgroundColor: "#F8F9FA"}}>
            <div className="container mb-3">
                <div className="box-2-column">
                    <div className="box-left-12 box-left-9-lg">
                        <div className="card mb-3">
                            <div className="card-body py-2">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="form-group mb-0">
                                        <div className="custom-control custom-checkbox">
                                            <input
                                                type="checkbox"
                                                className="custom-control-input"
                                                id="customCheckAll"
                                                name="customCheckAll"
                                                onChange={toggleSelectAll}
                                            />
                                            <label
                                                className="custom-control-label"
                                                htmlFor="customCheckAll"
                                            >
                                                Chọn tất cả
                                            </label>
                                        </div>
                                    </div>
                                    <div>
                                        <button className={`btn w-100 d-flex align-items-center ${!enableMutilRemove ? 'invisible' : ''}`} onClick={confirmRemoveItems}>
                                            <span className="d-block mr-2">
                                                <i
                                                    className="fa fa-trash-o fa--md text-grey"
                                                    aria-hidden="true"
                                                ></i>
                                            </span>
                                            <span className="d-block">Xóa</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        { 
                            items.map((item, index) => <CartItem item={item} index={index} setNewCart={setNewCart} setSomeOutOfStock={setSomeOutOfStock} />)
                        }
                    </div>
                    <div className="box-left-12 box-right-3-lg">
                        <div className="card mb-3">
                            <div className="card-body">
                                <label htmlFor="couponInput">
                                    <h2 className="title mb-3">
                                        Nhập mã khuyến mãi
                                    </h2>
                                </label>
                                <form className="coupon__section d-flex ">
                                    <div className="input-group mb-3">
                                        <input
                                            type="text"
                                            name="couponInput"
                                            id="couponInput"
                                            className="form-control rounded-left"
                                            defaultValue={coupon.code}
                                            aria-describedby="helpId"
                                            disabled={(!coupon.code) ? false : true}
                                        />
                                        <div className="input-group-append">
                                            {(!coupon.code) ? (
                                                <button
                                                    className="btn btn-success"
                                                    type="button"
                                                    onClick={applyCoupon}
                                                >
                                                    Áp dụng
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn btn-dark"
                                                    type="button"
                                                    onClick={removeCoupon}
                                                >
                                                    Hủy bỏ
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </form>
                                { (!coupon.couponIsValid && coupon.code) ? (
                                    <p className="text-danger">
                                        Mã khuyến mãi này đã hết hạn!
                                    </p>
                                ) : '' }
                                { (coupon.wrong) ? (
                                    <p className="text-danger">
                                        Mã khuyến mãi này không hợp lệ!
                                    </p>
                                ) : '' }
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-body">
                                <dl className="dlist-align">
                                    <dt>Tổng tiền:</dt>
                                    <dd className="text-right">{amount.totalAmount.toLocaleString("DE-de")}đ</dd>
                                </dl>
                                <dl className="dlist-align">
                                    <dt>Giảm giá:</dt>
                                    <dd className="text-right text-danger">
                                        - {(amount.totalAmount - amount.finalAmount).toLocaleString("DE-de")}đ
                                    </dd>
                                </dl>
                                <dl className="dlist-align">
                                    <dt>Thành tiền:</dt>
                                    <dd className="text-right text-dark b">
                                        <strong>{amount.finalAmount.toLocaleString("DE-de")}đ</strong>
                                    </dd>
                                </dl>
                                <hr />
                               
                                <a
                                    className="text-white btn btn--buy-now btn-block" onClick = {clickPay}
                                >
                                    Thanh toán
                                </a>
                               
                                <Link href="/"> 
                                    <a className="btn btn-light btn-block">
                                        Tiếp tục mua sắm
                                    </a>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                id="removeMutilConfirm"
                title="Bạn có chắc muốn xóa các sản phẩm này khỏi giỏ hàng?"
                confirmStyle="danger"
                cancelStyle="success"
                callback={removeSelectedItems}
            />
            <Footer />
            </div>
        </>
    );
};

