import Head from "next/head";
import { Header, Footer, Banner, RatingStars } from "../components";
import React, { useState, useEffect } from "react";
import Link from "next/link"
import Flickity from "react-flickity-component";
import { productApi } from "../apis";
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql } from "@apollo/client";

const client = new ApolloClient({
    uri: `${process.env.NEXT_PUBLIC_API_URL}/graphql`,
    cache: new InMemoryCache()
});

const getThreeBlogs = gql`
    query{
        blogs(limit:3){
            id
            title
            slug
            thumbnail{
                url
            }
        }
    }
`;

const NewsHot = () => {
    const { loading, error, data } = useQuery(getThreeBlogs);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :</p>;
    return (
        <div className="bannerNews--content row">
            {
                data.blogs.map(blog => (
                    <Link href={`/tin-tuc/` + blog.slug}>
                        <div className="bannerNews--content__item card col-4 border-0">
                            <img src={process.env.NEXT_PUBLIC_API_URL + blog.thumbnail.url} className="card-img-top" alt="..." />
                            <div className="card-body">
                                <h5 className="card-title">{blog.title}</h5>

                            </div>
                        </div>
                    </Link>
                ))
            }
        </div>
    )
}

export async function getServerSideProps() {
    const { data: {
        productHotSale,
        productsBestSell,
        productsBestNew,
    } } = await productApi.getForHome();

    return {
        props: {
            productHotSale,
            productsBestSell,
            productsBestNew,
        },
    };
}


export default function Home({ productHotSale, productsBestSell, productsBestNew }) {
    const [productRelated, setProductRelated] = useState([])
    const [display, setDisplay] = useState(false)
    useEffect(() => {
        if (window.localStorage.getItem('slug')) {
            var slugPr = window.localStorage.getItem('slug')
            setDisplay(true)
        }
        async function getProductRelated() {
            const { data: { productRelated } } = await productApi.getForHome(JSON.parse(slugPr));
            if (productRelated.length === 0) {
                setDisplay(false)
            }
            setProductRelated([...productRelated,...productHotSale])
        }
        getProductRelated()
    }, [])

    const setSlugHandler = (slugProduct) => {
        window.localStorage.setItem('slug', JSON.stringify(slugProduct))
    }
    const HotSale = productHotSale.map((product) => {
        const regularPrice = product.regularPrice.toLocaleString("DE-de");
        const finalPrice = product.finalPrice.toLocaleString("DE-de");
        // onClick={setSlugFromLocalStorage.bind(this,product.slug)}

        return (
            <Link href="/san-pham/[slug]" as={`/san-pham/${product.slug}`} key={product.id + "hotsales"}>
                <div onClick={setSlugHandler.bind(this, product.slug)} className="product">
                    <img src={process.env.NEXT_PUBLIC_API_URL + product.thumbnail.url} alt="" className="product__img mb-4" style={{ maxHeight: "204px", maxWidth: "204px" }} />
                    <span className="product__title">
                        <Link href="/san-pham/[slug]" as={`/san-pham/${product.slug}`} className="text-dark">
                            {product.name}
                        </Link>
                    </span>
                    <div className="product__price">
                        {product.salesPercentage === 0 ?
                            null :
                            <span className="sales-price">{finalPrice}₫</span>
                        }
                        <span className="regular-price">{regularPrice}₫</span>
                    </div>
                    <div className="product__rating">
                        <RatingStars stars={product.stars} />
                        <span>({product.votes} đánh giá)</span>
                    </div>
                    {
                        product.salesPercentage != 0 ?
                            <div className="product__box-sticker">
                                <p className="sticker-percent">{product.salesPercentage}%</p>
                            </div>
                            : null
                    }

                </div>
            </Link>
        )
    }
    )

    const productsNew = productsBestNew.map((product) => {
        const regularPrice = product.regularPrice.toLocaleString("DE-de");
        const finalPrice = product.finalPrice.toLocaleString("DE-de");

        return (
            <Link href="/san-pham/[slug]" as={`/san-pham/${product.slug}`} key={product.id + "newarrival"}>
                <div onClick={setSlugHandler.bind(this, product.slug)} className="product">
                    <img src={process.env.NEXT_PUBLIC_API_URL + product.thumbnail.url} alt="" className="product__img mb-4" style={{ maxHeight: "204px", maxWidth: "204px" }} />
                    <span className="product__title">
                        <Link href="/san-pham/[slug]" as={`/san-pham/${product.slug}`} className="text-dark">
                            {product.name}
                        </Link>
                    </span>
                    <div className="product__price">
                        {product.salesPercentage === 0 ?
                            null :
                            <span className="sales-price">{finalPrice}₫</span>
                        }
                        <span className="regular-price">{regularPrice}₫</span>
                    </div>
                    <div className="product__rating">
                        <RatingStars stars={product.stars} />
                        <span>({product.votes} đánh giá)</span>
                    </div>
                    {
                        product.salesPercentage != 0 ?
                            <div className="product__box-sticker">
                                <p className="sticker-percent">{product.salesPercentage}%</p>
                            </div>
                            : null
                    }

                </div>
            </Link>
        )
    }
    )

    const bestSeller = productsBestSell.map((product) => {
        const regularPrice = product.regularPrice.toLocaleString("DE-de");
        const finalPrice = product.finalPrice.toLocaleString("DE-de");

        return (
            <Link href="/san-pham/[slug]" as={`/san-pham/${product.slug}`} key={product.id + "bestsellers"}>
                <div onClick={setSlugHandler.bind(this, product.slug)} className="product">
                    <img src={process.env.NEXT_PUBLIC_API_URL + product.thumbnail.url} alt="" className="product__img mb-4" style={{ maxHeight: "204px", maxWidth: "204px" }} />
                    <span className="product__title">
                        <Link href="/san-pham/[slug]" as={`/san-pham/${product.slug}`} className="text-dark">
                            {product.name}
                        </Link>
                    </span>
                    <div className="product__price">
                        {product.salesPercentage === 0 ?
                            null :
                            <span className="sales-price">{finalPrice}₫</span>
                        }
                        <span className="regular-price">{regularPrice}₫</span>
                    </div>
                    <div className="product__rating">
                        <RatingStars stars={product.stars} />
                        <span>({product.votes} đánh giá)</span>
                    </div>
                    {
                        product.salesPercentage != 0 ?
                            <div className="product__box-sticker">
                                <p className="sticker-percent">{product.salesPercentage}%</p>
                            </div>
                            : null
                    }

                </div>
            </Link>
        )
    }
    )

    const productsRelated = productRelated.map((product) => {
        const regularPrice = product.regularPrice.toLocaleString("DE-de");
        const finalPrice = product.finalPrice.toLocaleString("DE-de");

        return (
            <Link href="/san-pham/[slug]" as={`/san-pham/${product.slug}`} key={product.id + "newarrival"}>
                <div onClick={setSlugHandler.bind(this, product.slug)} className="product">
                    <img src={process.env.NEXT_PUBLIC_API_URL + product.thumbnail.url} alt="" className="product__img mb-4" style={{ maxHeight: "204px", maxWidth: "204px" }} />
                    <span className="product__title">
                        <Link href="/san-pham/[slug]" as={`/san-pham/${product.slug}`} className="text-dark">
                            {product.name}
                        </Link>
                    </span>
                    <div className="product__price">
                        {product.salesPercentage === 0 ?
                            null :
                            <span className="sales-price">{finalPrice}₫</span>
                        }
                        <span className="regular-price">{regularPrice}₫</span>
                    </div>
                    <div className="product__rating">
                        <RatingStars stars={product.stars} />
                        <span>({product.votes} đánh giá)</span>
                    </div>
                    {
                        product.salesPercentage != 0 ?
                            <div className="product__box-sticker">
                                <p className="sticker-percent">{product.salesPercentage}%</p>
                            </div>
                            : null
                    }

                </div>
            </Link>
        )
    }
    )

    const flickityOptions = {
        initialIndex: 0,
        freeScroll: true,
        imagesLoaded: true,
        prevNextButtons: false,
        pageDots: false,
        contain: true
    }

    const ProductList = (typeCategory) => {
        return (
            <div className="container-fluid" style={{ backgroundColor: "#FFF" }}>
                <div className="container">
                    <div className="box">
                        <div className="box-title px-3">
                            <h2 className="title">
                                <i className="fa fa-fire" aria-hidden="true"></i> &nbsp; {typeCategory}
                            </h2>
                            <div className="col text-right">
                                <a href="" className="text-blue">Xem tất cả</a>
                            </div>
                        </div>
                        <div className="box-body">
                            <Flickity
                                className={'product-list border-0 overflowAuto'} // default ''
                                elementType={'div'} // default 'div'
                                options={flickityOptions} // takes flickity options {}
                                disableImagesLoaded={false} // default false
                                reloadOnUpdate // default false
                                static // default false
                            >
                                {
                                    typeCategory === 'Hot sales' ? HotSale :
                                        typeCategory === 'Bán chạy' ? bestSeller :
                                            typeCategory === 'Mới nhất' ? productsNew :
                                                typeCategory === 'Đề xuất' ? productsRelated : ''
                                }
                            </Flickity>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <ApolloProvider client={client}>
            <div
                //  className="bodyIndex" 
                id="root"
            >
                <Head>
                    <title>Trang chủ</title>
                </Head>
                <Header />
                <Banner />
                {ProductList('Hot sales')}
                {display && ProductList('Đề xuất')}
                {ProductList('Mới nhất')}
                {/* Banner Iphone */}
                <div className="bannerIphone row mx-0">
                    <div className="bannerIphone--text col-5">
                        <div>
                            <b><h3 className=" px-auto">Tại sao DeveraShop là nơi tuyệt vời để mua iPhone?</h3></b>
                            <p>Bạn có thể chọn một tùy chọn thanh toán phù hợp với mình, thanh toán ít hơn
                                khi giao dịch, kết nối iPhone mới với nhà cung cấp dịch vụ của bạn và thiết lập nhanh chóng.
                                Bạn cũng có thể trò chuyện với Chuyên gia bất cứ lúc nào.
                            </p>
                            <Link href="/ket-qua-tim-kiem?name=iphone">
                                <button className="bannerIphone--text__btn px-3 py-2">Khám phá ngay</button>
                            </Link>
                        </div>
                    </div>
                    <div className="bannerIphone--img col-7 px-0">
                        {/* <img
                        src="./img/iphoneWallPaper.jpg"
                        style={{ width: '100%' }}
                    >
                    </img> */}
                    </div>
                </div>

                {/* Banner Samsung */}
                <div className="bannerSamsung row mx-0">
                    <div className="bannerSamsung--img col-lg-8 px-0"></div>
                    <div className="bannerSamsung--text col-lg-4">
                        <div>
                            <b><h3 className=" px-auto">Sáng Tạo Những Khoảnh Khắc Ấn Tượng Với Samsung Galaxy S21 Ultra 5G </h3></b>
                            <p>Được thiết kế với camera cắt viền độc đáo, tạo ra một cuộc cách mạng trong nhiếp ảnh –
                                cho phép bạn quay video 8K chất lượng điện ảnh và chụp nhanh những bức ảnh tuyệt vời,
                                tất cả trong một thao tác. Và với chipset nhanh nhất của Galaxy, loại kính mạnh nhất,
                                5G và pin dùng cả ngày, Ultra dễ dàng tạo nên tên tuổi của mình.
                            </p>
                            <Link href="/ket-qua-tim-kiem?name=samsung">
                                <button className="bannerSamsung--text__btn px-3 py-2">Khám phá ngay</button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Banner About Us */}
                <div className="bannerUs mx-0 d-block">
                    <div className="bannerUs--text">
                        <b><h3 className="bannerUs--text__title px-auto py-3">Group1's journey</h3></b>
                        <p className="bannerUs--text__content py-3">DeveraShop nhiều năm liền có tên trong các bảng xếp hạng danh giá như TOP 500
                            nhà bán lẻ hàng đầu Châu Á – Thái Bình Dương (Retail Asia) và dẫn đầu TOP 50 công ty kinh doanh
                            hiệu quả nhất Việt Nam (Nhịp Cầu Đầu Tư)… Sự phát triển của DVR cũng là một điển hình tốt được
                            nghiên cứu tại các trường Đại học hàng đầu như Harvard, UC Berkeley, trường kinh doanh Tuck.
                        </p>
                    </div>
                </div>

                {ProductList('Bán chạy')}

                {/* Banner News */}

                <div className="bannerNews row">
                    <div className=" col-12 d-flex justify-content-center align-items-center pb-3">
                        <Link href="new">
                            <h3 className="bannerNews--title">Tin tức mới nhất</h3>
                        </Link>
                    </div>
                    <NewsHot />
                </div>


                <Footer />
            </div>
        </ApolloProvider>
    )
}
