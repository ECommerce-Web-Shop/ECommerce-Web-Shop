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
                            <span className="sales-price">{finalPrice}???</span>
                        }
                        <span className="regular-price">{regularPrice}???</span>
                    </div>
                    <div className="product__rating">
                        <RatingStars stars={product.stars} />
                        <span>({product.votes} ????nh gi??)</span>
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
                            <span className="sales-price">{finalPrice}???</span>
                        }
                        <span className="regular-price">{regularPrice}???</span>
                    </div>
                    <div className="product__rating">
                        <RatingStars stars={product.stars} />
                        <span>({product.votes} ????nh gi??)</span>
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
                            <span className="sales-price">{finalPrice}???</span>
                        }
                        <span className="regular-price">{regularPrice}???</span>
                    </div>
                    <div className="product__rating">
                        <RatingStars stars={product.stars} />
                        <span>({product.votes} ????nh gi??)</span>
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
                            <span className="sales-price">{finalPrice}???</span>
                        }
                        <span className="regular-price">{regularPrice}???</span>
                    </div>
                    <div className="product__rating">
                        <RatingStars stars={product.stars} />
                        <span>({product.votes} ????nh gi??)</span>
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
                                <a href="" className="text-blue">Xem t???t c???</a>
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
                                        typeCategory === 'B??n ch???y' ? bestSeller :
                                            typeCategory === 'M???i nh???t' ? productsNew :
                                                typeCategory === '????? xu???t' ? productsRelated : ''
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
                    <title>Trang ch???</title>
                </Head>
                <Header />
                <Banner />
                {ProductList('Hot sales')}
                {display && ProductList('????? xu???t')}
                {ProductList('M???i nh???t')}
                {/* Banner Iphone */}
                <div className="bannerIphone row mx-0">
                    <div className="bannerIphone--text col-5">
                        <div>
                            <b><h3 className=" px-auto">T???i sao DeveraShop l?? n??i tuy???t v???i ????? mua iPhone?</h3></b>
                            <p>B???n c?? th??? ch???n m???t t??y ch???n thanh to??n ph?? h???p v???i m??nh, thanh to??n ??t h??n
                                khi giao d???ch, k???t n???i iPhone m???i v???i nh?? cung c???p d???ch v??? c???a b???n v?? thi???t l???p nhanh ch??ng.
                                B???n c??ng c?? th??? tr?? chuy???n v???i Chuy??n gia b???t c??? l??c n??o.
                            </p>
                            <Link href="/ket-qua-tim-kiem?name=iphone">
                                <button className="bannerIphone--text__btn px-3 py-2">Kh??m ph?? ngay</button>
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
                            <b><h3 className=" px-auto">S??ng T???o Nh???ng Kho???nh Kh???c ???n T?????ng V???i Samsung Galaxy S21 Ultra 5G </h3></b>
                            <p>???????c thi???t k??? v???i camera c???t vi???n ?????c ????o, t???o ra m???t cu???c c??ch m???ng trong nhi???p ???nh ???
                                cho ph??p b???n quay video 8K ch???t l?????ng ??i???n ???nh v?? ch???p nhanh nh???ng b???c ???nh tuy???t v???i,
                                t???t c??? trong m???t thao t??c. V?? v???i chipset nhanh nh???t c???a Galaxy, lo???i k??nh m???nh nh???t,
                                5G v?? pin d??ng c??? ng??y, Ultra d??? d??ng t???o n??n t??n tu???i c???a m??nh.
                            </p>
                            <Link href="/ket-qua-tim-kiem?name=samsung">
                                <button className="bannerSamsung--text__btn px-3 py-2">Kh??m ph?? ngay</button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Banner About Us */}
                <div className="bannerUs mx-0 d-block">
                    <div className="bannerUs--text">
                        <b><h3 className="bannerUs--text__title px-auto py-3">Group1's journey</h3></b>
                        <p className="bannerUs--text__content py-3">DeveraShop nhi???u n??m li???n c?? t??n trong c??c b???ng x???p h???ng danh gi?? nh?? TOP 500
                            nh?? b??n l??? h??ng ?????u Ch??u ?? ??? Th??i B??nh D????ng (Retail Asia) v?? d???n ?????u TOP 50 c??ng ty kinh doanh
                            hi???u qu??? nh???t Vi???t Nam (Nh???p C???u ?????u T??)??? S??? ph??t tri???n c???a DVR c??ng l?? m???t ??i???n h??nh t???t ???????c
                            nghi??n c???u t???i c??c tr?????ng ?????i h???c h??ng ?????u nh?? Harvard, UC Berkeley, tr?????ng kinh doanh Tuck.
                        </p>
                    </div>
                </div>

                {ProductList('B??n ch???y')}

                {/* Banner News */}

                <div className="bannerNews row">
                    <div className=" col-12 d-flex justify-content-center align-items-center pb-3">
                        <Link href="new">
                            <h3 className="bannerNews--title">Tin t???c m???i nh???t</h3>
                        </Link>
                    </div>
                    <NewsHot />
                </div>


                <Footer />
            </div>
        </ApolloProvider>
    )
}
