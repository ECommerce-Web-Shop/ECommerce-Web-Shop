import React, { useState } from "react";
import { cartApi } from "../../apis";
import { Modal } from "../../components";

export default function CartItem({item, index, setNewCart, setSomeOutOfStock}) {
    let outOfStock = false;
    let qtyInStock = 0;

    const itemOptions = item.product.options.map(option => {
        if(option.color === item.color) {
            if(item.qty > option.quantityInStock) {
                setSomeOutOfStock(true);
                outOfStock = true;
            }

            qtyInStock = option.quantityInStock;
            return <option value={option.color} selected disabled={option.quantityInStock <= 0}>{ option.color }</option>;
        }
        
        return <option value={option.color} disabled={option.quantityInStock <= 0}>{ option.color }</option>;
    });

    const changeItemColor = async (e, itemId) => {
        const color = e.target.value;

        try {
            const {data: { cart }} = await cartApi.changeItemColor(localStorage.getItem('cartId'), itemId, color);
            setNewCart(cart);
        } catch(error) {
            console.log(error);
        } 
    }

    const decrementQuantityItemByOne = async (itemId, qtyInputId) => {
        const currentQty = Number(document.getElementById(qtyInputId).value);
        if(currentQty - 1 < 1) 
            return $(`#warningDecreQty_${index}`).modal();

        try {
            const { data: { cart } } = await cartApi.decrementQuantity(localStorage.getItem('cartId'), itemId, 1);
            setNewCart(cart);
        } catch(error) {
            console.log(error);
        }
    };

    const incrementQuantityItemByOne = async (itemId, qtyInputId) => {
        const currentQty = Number(document.getElementById(qtyInputId).value);
        if(currentQty + 1 > qtyInStock)
            return $(`#warningIncreQty_${index}`).modal();

        try {
            const { data: { cart } } = await cartApi.incrementQuantity(localStorage.getItem('cartId'), itemId, 1);
            console.log(cart);
            setNewCart(cart);
        } catch(error) {
            console.log(error);
        }
    }

    const toggleSelectItem = async (e, itemId) => {
        const value = e.target.checked;
        try {
            const { data: { cart } } = await cartApi.toggleSelectItem(localStorage.getItem("cartId"), itemId, value);
            setNewCart(cart);
        } catch(error) {
            console.log(error);
        }
    };
                   
    const removeItem = async itemId => {
        try {
            const { data: { cart } } = await cartApi.removeItem(localStorage.getItem('cartId'), itemId);
            setNewCart(cart);
        } catch(error) {
            console.log(error);
        }
    };

    const outOfStockStyle = outOfStock ? {
        border: "1px solid red"
    } : {};

    return (
        <>
        <div className="card mb-3" key={`checkbox${index}`} style={outOfStockStyle}>
            <div className="card-body">
                <div className="row align-items-center">
                    <div className="col-1">
                        <div className="form-group">
                            <div className="custom-control custom-checkbox">
                                <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    id={`customCheck${index}`}
                                    name={`customCheck${index}`}
                                    defaultChecked={item.selected}
                                    onChange={e =>  toggleSelectItem(e, item._id)}
                                />
                                <label
                                    className="custom-control-label"
                                    for={`customCheck${index}`}
                                ></label>
                            </div>
                        </div>
                    </div>
                    <div className="col-5 col-lg-2 pl-0">
                        <img
                            className="img-fluid"
                            src={process.env.NEXT_PUBLIC_API_URL + item.product.thumbnail.url}
                            alt=""
                        />
                    </div>
                    <div className="col">
                        <div className="row align-items-center">
                            <div className="col-12 col-lg-5 mb-3">
                                <p className="font-weight-bold">
                                    {item.product.name}
                                </p>
                                <div className="form-group mb-0">
                                    {/* <label for=""></label> */}
                                    <select
                                        className="form-control form-control-sm bg-grey border"
                                        onChange={e => changeItemColor(e, item._id)}
                                    >
                                        { itemOptions }
                                    </select>
                                </div>
                            </div>
                            <div className="col-12 col-lg-4 mb-3 text-center">
                                <p className="regular-price center">
                                    {item.product.finalPrice.toLocaleString("DE-de")}đ
                                </p>
                                <button
                                    type="button"
                                    className="btn btn-light"
                                    onClick={() => $(`#removeItemConfirm_${index}`).modal()}
                                >
                                    <i
                                        className="fa fa-trash"
                                        aria-hidden="true"
                                    ></i>
                                </button>
                            </div>
                            <div className="col-12 col-lg-3">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <button
                                            className="btn btn-quantity-control border rounded-0"
                                            type="button"
                                            id="button-addon1"
                                            onClick={() => decrementQuantityItemByOne(item._id, `qtyInput${index}`)}
                                            disabled={item.qty <= 1}
                                        >
                                            -
                                        </button>
                                    </div>
                                    <input
                                        type="number"
                                        className="form-control text-center border rounded-0 pr-0"
                                        defaultValue={item.qty}
                                        id={`qtyInput${index}`}
                                        min={1}
                                        max={qtyInStock}
                                        disabled
                                        aria-label="Example text with button addon"
                                        aria-describedby="button-addon1"
                                    />
                                    <div className="input-group-append">
                                        <button
                                            className="btn btn-quantity-control border rounded-0"
                                            type="button"
                                            id="button-addon2"
                                            onClick={() => incrementQuantityItemByOne(item._id, `qtyInput${index}`)}
                                            disabled={item.qty >= qtyInStock}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <p className="text-center mt-3">Còn lại: {qtyInStock}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Modal
            id={`removeItemConfirm_${index}`}
            title="Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?"
            confirmStyle="danger"
            cancelStyle="success"
            callback={() => removeItem(item._id)}
        ></Modal>
        <Modal
            id={`warningDecreQty_${index}`}
            title={`Số lượng tối thiểu để bạn có thể mua sản phẩm này là: 1`}
            confirmStyle="success"
            onlyConfirm={true}
        ></Modal>
        <Modal
            id={`warningIncreQty_${index}`}
            title={`Số lượng tối đa mà bạn có thể mua với sản phẩm này là: ${qtyInStock}`}
            confirmStyle="success"
            onlyConfirm={true}
        ></Modal>
        </>
    )
}
