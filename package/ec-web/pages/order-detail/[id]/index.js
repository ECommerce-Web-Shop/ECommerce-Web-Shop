import Head from 'next/head'
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
import client from '../../../components/Category/apolloClient'
import { gql } from "@apollo/client";

export const getServerSideProps = async ({ params }) => {
    const { data } = await client.query({
        query: gql`
            query($id: ID!){
                order (id : $id){
                    id
                    orderId
                    items{
                        product{
                            name
                            regularPrice
                            finalPrice
                            thumbnail{
                                url
                            }
                        }
                        unitPrice
                        totalPrice
                        qty
                        color
                    }
                    coupon{
                        discountAmount
                    }
                    isPaid
                    status
                    finalAmount
                }
            }
        `,
        variables: {
            id: params.id
        }
    })
    return {
        props: {
            order: data.order
        }
    }
}

export default function OrderDetail({ order }) {

    const item = order.items.map(item => {
        return (
             <div class="row order-detail__item">
                <div class="col-sm-2 col-info col-info--product">
                    <img class="order-detail__img" src={process.env.NEXT_PUBLIC_API_URL + item.product.thumbnail.url} />
                </div>
                <div class="col-sm-2 col-info">
                    <p class="order-detail__info">{item.product.name}</p>
                </div>
                <div class="col-sm-2 col-info">
                    <p class="order-detail__info">{item.unitPrice.toLocaleString("DE-de")} ₫</p>
                </div>
                <div class="col-sm-2 col-info">
                    <p class="order-detail__info">{item.color}</p>
                </div>
                <div class="col-sm-2 col-info">
                    <p class="order-detail__info">{item.qty}</p>
                </div>
                <div class="col-sm-2 col-info">
                    <p class="order-detail__info">{item.totalPrice.toLocaleString("DE-de")} ₫</p>
                </div>
            </div>
        )
    })
    
    const itemMoble = order.items.map(item => {
        return (
            <div class="order-detail__moble-item">
                <div class="od-detail__moble-1">
                    <div class="od-moble__img">
                        <img class="order-detail__img" src={process.env.NEXT_PUBLIC_API_URL + item.product.thumbnail.url} />
                    </div>
                    <div class="od-moble__info od-moble__info--item">
                        <p><b>Sản phẩm</b> <span>{item.product.name}</span></p>
                        <p><b>Giá</b> <span> {item.unitPrice.toLocaleString("DE-de")} ₫</span></p>
                        <p><b>Màu sắc</b> <span>{item.color}</span></p>
                        <p><b>Số lượng</b> <span>{item.qty}</span></p>
                        <p><b>Tạm tính</b> <span>{item.totalPrice.toLocaleString("DE-de")} ₫</span></p>
                    </div>
                </div>
            </div>
        )
    })

    const OrderDetail = () => (
        <div>
            <nav class="breadcrumb breadcrumb--custom my-1">
                <div class="container px-0">
                    <a class="breadcrumb-item" href="/">Trang chủ</a>
                    <span class="breadcrumb-item active">Quản lý đơn hàng</span>
                </div>
            </nav>

            <div class="container-fluid" style={{ backgroundColor: "#f0f0f0" }}>
                <div class="container py-4">
                    <div class="row">
                        <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12 on-big-screen">
                            <div>
                                <h2 class="bill-detail__title">Chi tiết đơn hàng #{order.orderId}</h2>
                            </div>
                            <div class="container order-detail">
                                {/*<div class="row ">
                                    <div class="link-button">
                                        <div class="link-button__item">
                                            <a href="">Đánh giá</a>
                                        </div>
                                        <div class="link-button__item">
                                            <a href="">Mua lại</a>
                                        </div>
                                    </div>
                                </div>*/}
                                <div class="row order-detail__heading">
                                    <div class="col-sm-2 order-detail__title">
                                        <h5>Sản phẩm</h5>
                                    </div>
                                    <div class="col-sm-2 order-detail__title">
                                        {/*<h5>Giá</h5>*/}
                                    </div>
                                    <div class="col-sm-2 order-detail__title">
                                        <h5>Giá</h5>
                                    </div>
                                    <div class="col-sm-2 order-detail__title">
                                        <h5>Màu sắc</h5>
                                    </div>
                                    <div class="col-sm-2 order-detail__title">
                                        <h5>Số lượng</h5>
                                    </div>
                                    <div class="col-sm-2 order-detail__title">
                                        <h5>Tạm tính</h5>
                                    </div>
                                </div>
                                 {item}
                                <div class="row final-price">
                                    <div class="col-sm-3 final-price__title">
                                        <p><b>Tạm tính: </b></p>
                                        <p><b>Phí vận chuyển: </b></p>
                                        <p><b>Tổng cộng: </b></p>
                                    </div>
                                    <div class="col-sm-2 final-price__value">
                                        <p>{order.finalAmount.toLocaleString("DE-de")} ₫</p>
                                        <p>0 đ</p>
                                        <p> {order.finalAmount.toLocaleString("DE-de")} ₫</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="container order-detail__moble">
                            <div class="container main-title__moble">
                                <div class="row">
                                <h1>Chi tiết đơn hàng #3534534534</h1>
                                </div>
                            </div>
                            <div class="row order-detail__moble-content">
                                {itemMoble}
                                <div class="od-moble-2 od-moble__info">
                                    <p><b>Tạm tính</b> <span>{order.finalAmount.toLocaleString("DE-de")} ₫</span></p>
                                    <p><b>Phí vận chuyển</b> <span> 0 đ</span></p>
                                    <p><b>Tạm tính</b> <span>{order.finalAmount.toLocaleString("DE-de")} ₫</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
    return (
        <div id="root">
            <Head>
                <title>Chi tiết đơn hàng</title>
                <link rel="stylesheet" href="../../css/customer-info.css" />
            </Head>
            <Header />
            <OrderDetail />
            <Footer />
        </div>
    )
}
