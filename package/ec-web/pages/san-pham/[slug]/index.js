import Head from "next/head";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { Header, Footer, Modal, Review, RatingStars, Product } from "../../../components";
import withIronSession from "../../../helpers/customWithIronSession";
import axios from "axios";
import Flickity from "react-flickity-component";
import { productApi, reviewApi } from "../../../apis";
import { graphqlClient, gql } from "../../../helpers/apollo-client";
import { useRouter } from "next/router";

export const getServerSideProps = withIronSession(async ({ req, res, params }) => {
    const jwt = req.session.get("user") ? req.session.get("user").jwt : null;

    const { data: {
        product,
        relatedProducts,
        reviewList,
    }} = await productApi.getForProductPage(params.slug, {
        useAxiosClient: false,
        jwt,
    });

    return {
        props: {
            product: product[0],
            reviewList: reviewList,
            isSignedIn: jwt ? true : false,
            slug: params.slug,
            relatedProducts: relatedProducts,
            jwt,
        },
    };
});

export default function ProductPage({
    product,
    reviewList,
    isSignedIn,
    slug,
    relatedProducts,
    jwt,
}) {
    const [stars, setStars] = useState(5);
    // const [selectedColor, setSelectedColor] = useState(product.options[0].color);
    const [selectedColor, setSelectedColor] = useState(product.options.find(option => option.quantityInStock > 0).color)
    const [userReview, setUserReview] = useState(reviewList.userReview);
    const [reviews, setReviews] = useState(reviewList.reviews);
    const [overviews, setOverviews] = useState(reviewList.overviews);
    const [isEditing, setIsEditing] = useState(false);
    const [displayNumber, setDisplayNumber] = useState(1);
    const [reload, setReload] = useState();
    const [idProduct, setIdProduct] = useState(product._id);
    const regularPrice = product.regularPrice.toLocaleString("DE-de");
    const finalPrice = product.finalPrice.toLocaleString("DE-de");
    const router = useRouter();
    // S???n ph???m li??n quan
    const relatedProduct = relatedProducts.slice(0, 4).map((product, index) => {
        const regularPrice = product.regularPrice.toLocaleString("DE-de");
        const finalPrice = product.finalPrice.toLocaleString("DE-de");
        return (
            <div className="product col-6 col-md-3 col-lg-10 col-xl-9 my-3">
                <img
                    src={process.env.NEXT_PUBLIC_API_URL + product.thumbnail.url}
                    alt=""
                    className="product__img mb-4"
                />
                <Link href="/san-pham/[slugProduct]" as={`/san-pham/${product.slug}`}>
                    <span className="product__title" style={{ cursor: "pointer" }}>
                        {product.name}
                    </span>
                </Link>
                <div className="product__price">
                    <span className="sales-price">{finalPrice}???</span>
                    <span className="regular-price">{regularPrice}???</span>
                </div>
                <div className="product__rating">
                    <RatingStars key={"related" + index} stars={product.stars} />
                    <span>({product.votes} ????nh gi??)</span>
                </div>
                {product.salespercentage > 0 ? (
                    <div className="product__box-sticker">
                        <p className="sticker-percent">-{product.salespercentage}%</p>
                    </div>
                ) : (
                    ""
                )}
            </div>
        );
    });

    // H??nh ???nh l???n c???a s???n ph???m
    const largePic = () => {
        if (product.options) {
            return product.options.map((option, index) => {
                return option.images.map((image, index) => {
                    return (
                        <img
                            className="product-image"
                            src={process.env.NEXT_PUBLIC_API_URL + image.url}
                            alt=""
                        />
                    );
                });
            });
        }
    };

    // H??nh ???nh nh??? c???a s???n ph???m
    const thumbs = () => {
        if (product.options) {
            return product.options.map((option, indexOption) => {
                return option.images.map((image, index) => (
                    <img
                        className={index === 0 ? "thumbnail active" : "thumbnail"}
                        src={process.env.NEXT_PUBLIC_API_URL + image.url}
                        alt={index}
                    />
                ));
            });
        }
    };

    useEffect(()=>{
        $('#colors div:not(".versionDisabled"):first').addClass("active")
    },[])

    // C??c l???a ch???n m??u s???c
    const colorOption = () => {
        if (product.options) {
            return product.options.map((option, index) => {
                if (option.quantityInStock <= 0){
                    return (
                        <div
                            className="versionDisabled"
                            style={{pointerEvents: "none"}}
                            key={`option${index}`}
                        >
                            {option.color}
                            <span className="version__price">
                                {index >= 2 ? regularPrice : finalPrice}
                            </span>
                            <span>
                                C??n l???i: {option.quantityInStock}
                            </span>
                        </div>
                    );
                }
                else {
                    return (
                        <div
                            className="version"
                            onClick={() => setSelectedColor(option.color)}
                            key={`option${index}`}
                        >
                            {option.color}
                            <span className="version__price">
                                {index >= 2 ? regularPrice : finalPrice}
                            </span>
                            <span>
                                C??n l???i: {option.quantityInStock}
                            </span>
                        </div>
                    );
                }
            });
        }
    };

    // Display reviewing form
    const displayReviewingForm = () => {
        if (isSignedIn) {
            if (userReview) {
                if (!isEditing)
                    return (
                        <>
                            <p className="font-weight-bold my-2">????nh gi?? c???a b???n</p>
                            <Review
                                username={userReview.user.username}
                                stars={userReview.stars}
                                comment={userReview.comment}
                                postedTime={userReview.createdAt}
                            />
                            <div className="d-flex justify-content-between mb-3">
                                <button
                                    type="button"
                                    className="btn btn-success"
                                    onClick={() => {
                                        setStars(userReview.stars);
                                        setIsEditing(true);
                                    }}
                                >
                                    <i
                                        className="fa fa-pencil-square-o mr-2"
                                        aria-hidden="true"
                                    ></i>
                                    Ch???nh s???a
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => {
                                        $(`#deleteConfirm`).modal();
                                    }}
                                >
                                    <i className="fa fa-trash mr-2" aria-hidden="true"></i>
                                    X??a
                                </button>
                            </div>
                            <Modal
                                id="deleteConfirm"
                                title="B???n c?? ch???c mu???n x??a b??i ????nh gi?? n??y?"
                                body="B??i ????nh gi?? sau khi x??a s??? kh??ng th??? kh??i ph???c ???????c. B???n c?? ch???c mu???n th???c hi???n ??i???u n??y?"
                                confirmStyle="danger"
                                cancelStyle="secondary"
                                callback={handleSubmitDeleteReview}
                            />
                        </>
                    );
                else {
                    return (
                        <form action className="px-0">
                            <p className="font-weight-bold my-2">Ch???nh s???a ????nh gi??</p>
                            <div className="form-group w-100">
                                <label>????nh gi?? c???a b???n: </label>
                                <span className="rating-result ml-3">
                                    {displayStars(stars)}
                                </span>
                                <textarea
                                    className="form-control mb-3"
                                    name="comment"
                                    id="comment"
                                    rows={3}
                                    defaultValue={userReview.comment}
                                />
                                <button
                                    className="btn btn-success"
                                    id="editReviewBtn"
                                    onClick={handleSubmitEditReview}
                                >
                                    Ch???nh s???a
                                </button>
                            </div>
                        </form>
                    );
                }
            } else
                return (
                    <form action className="px-0">
                        <p className="font-weight-bold my-2">????nh gi?? s???n ph???m n??y</p>
                        <div className="form-group w-100">
                            <label>????nh gi?? c???a b???n: </label>
                            <span className="rating-result ml-3">{displayStars(stars)}</span>
                            <textarea
                                className="form-control mb-3"
                                name="comment"
                                id="comment"
                                rows={3}
                                defaultValue={""}
                            />
                            <button
                                className="btn btn-success"
                                id="createReviewBtn"
                                onClick={handleSubmitCreateReview}
                            >
                                G???i ngay
                            </button>
                        </div>
                    </form>
                );
        } else
            return (
                <div className="alert alert-warning my-3" role="alert">
                    Qu?? kh??ch vui l??ng <Link href="/login">????ng nh???p</Link> ????? c?? th??? ????nh
                    gi?? s???n ph???m
                </div>
            );
    };

    const displayReviews = () => {
        const reviewElements = reviews
            .slice(0, displayNumber)
            .map((review) => (
                <Review
                    username={review.user.username}
                    stars={review.stars}
                    comment={review.comment}
                    postedTime={review.createdAt}
                />
            ));
        return (
            <>
                <div className="form-group form-inline">
                    <label className="mr-2">X???p theo: </label>
                    <select
                        className="form-control"
                        name="sortBy"
                        id="sortBy"
                        onChange={handleSort}
                    >
                        <option value="createdAt:desc">M???i nh???t</option>
                        <option value="createdAt:asc">C?? nh???t</option>
                        <option value="stars:desc">T??ch c???c</option>
                        <option value="stars:asc">Ti??u c???c</option>
                    </select>
                </div>
                {reviewElements}
                {displayNumber < reviewList.reviews.length ? (
                    <p className="text-center">
                        <button
                            type="button"
                            class="btn btn-success mt-3"
                            onClick={loadMore}
                        >
                            T???i th??m...
                        </button>
                    </p>
                ) : (
                    ""
                )}
                {reviewList.reviews.length === 0 ? (
                    <p className="text-center my-5">
                        Hi???n ch??a c?? ????nh gi?? v??? s???n ph???m n??y
                    </p>
                ) : (
                    ""
                )}
            </>
        );
    };

    const displayOverviews = () => {
        let oneStarPercentage = 0,
            twoStarPercentage = 0,
            threeStarPercentage = 0,
            fourStarPercentage = 0,
            fiveStarPercentage = 0;
        if (overviews.total) {
            oneStarPercentage = ((overviews.oneStar / overviews.total) * 100).toFixed(
                2
            );
            twoStarPercentage = ((overviews.twoStar / overviews.total) * 100).toFixed(
                2
            );
            threeStarPercentage = (
                (overviews.threeStar / overviews.total) *
                100
            ).toFixed(2);
            fourStarPercentage = (
                (overviews.fourStar / overviews.total) *
                100
            ).toFixed(2);
            fiveStarPercentage = (
                (overviews.fiveStar / overviews.total) *
                100
            ).toFixed(2);
        }
        return (
            <div className="d-flex justify-content-between row mx-0 p-3 border">
                <div className="customer-reviews__overviews">
                    <span className="overviews__grade">{overviews.average}/5</span>
                    <span className="rating-result">
                        <RatingStars stars={overviews.average} />
                    </span>
                    <span className="overviews__quantity-reviews mt-1">
                        {overviews.total} ????nh gi??
                    </span>
                </div>
                <div className="customer-reviews__details">
                    <div className="rating-details">
                        <span className="rating-result">
                            5
                            <i className="fa fa-star checked" aria-hidden="true" />
                        </span>
                        <div className="rate-status">
                            <div
                                className="rate-status__progress"
                                style={{ width: `${fiveStarPercentage}%` }}
                            />
                        </div>
                        <span className="rating__ratio">{`${fiveStarPercentage}%`}</span>
                    </div>
                    <div className="rating-details">
                        <span className="rating-result">
                            4
                            <i className="fa fa-star checked" aria-hidden="true" />
                        </span>
                        <div className="rate-status">
                            <div
                                className="rate-status__progress"
                                style={{ width: `${fourStarPercentage}%` }}
                            />
                        </div>
                        <span className="rating__ratio">{`${fourStarPercentage}%`}</span>
                    </div>
                    <div className="rating-details">
                        <span className="rating-result">
                            3
                            <i className="fa fa-star checked" aria-hidden="true" />
                        </span>
                        <div className="rate-status">
                            <div
                                className="rate-status__progress"
                                style={{ width: `${threeStarPercentage}%` }}
                            />
                        </div>
                        <span className="rating__ratio">{`${threeStarPercentage}%`}</span>
                    </div>
                    <div className="rating-details">
                        <span className="rating-result">
                            2
                            <i className="fa fa-star checked" aria-hidden="true" />
                        </span>
                        <div className="rate-status">
                            <div
                                className="rate-status__progress"
                                style={{ width: `${twoStarPercentage}%` }}
                            />
                        </div>
                        <span className="rating__ratio">{`${twoStarPercentage}%`}</span>
                    </div>
                    <div className="rating-details">
                        <span className="rating-result">
                            1
                            <i className="fa fa-star checked" aria-hidden="true" />
                        </span>
                        <div className="rate-status">
                            <div
                                className="rate-status__progress"
                                style={{ width: `${oneStarPercentage}%` }}
                            />
                        </div>
                        <span className="rating__ratio">{`${oneStarPercentage}%`}</span>
                    </div>
                </div>
            </div>
        );
    };

    const refreshReviews = async () => {
        try {
            // Declare query & its variables
            const { data: { reviewList } } = await reviewApi.getProductReviews(slug);
            setReviews([]);
            setUserReview(null);
            setReviews(reviewList.reviews);
            setUserReview(reviewList.userReview);
            setOverviews(reviewList.overviews);

            return true;
        } catch(error) {
            console.log(error);
            return false;
        }
    };
    const handleSubmitCreateReview = async (e) => {
        e.preventDefault();
        const comment = document.getElementById("comment").value;
        const btnEle = document.getElementById("createReviewBtn");

        if (!comment) return alert("Vui l??ng nh???p b??nh lu???n cho ????nh gi?? c???a b???n");

        try {
            btnEle.setAttribute("disabled", true);
            btnEle.innerHTML = `
                <span class="spinner-border spinner-border-sm"></span>
                ??ang g???i... 
            `;

            const {data: { newReview } } = await reviewApi.createReview(slug, comment, stars);

            await refreshReviews();

            btnEle.removeAttribute("disabled");
            btnEle.innerHTML = "G???i ngay";

            if (!newReview) return alert("C?? l???i x???y ra, vui l??ng th??? l???i sau");
        } catch (error) {
            btnEle.removeAttribute("disabled");
            btnEle.innerHTML = `
                G???i ngay 
            `;
        }
    };

    const handleSubmitDeleteReview = async (e) => {
        e.preventDefault();
        const modal = document.getElementById("deleteConfirm");
        const yesBtn = modal.querySelector("#yesBtn");

        try {
            yesBtn.setAttribute("disabled", true);
            yesBtn.innerHTML = `
                <span class="spinner-border spinner-border-sm"></span>
                ??ang x??a... 
            `;

            const { data: { deletedReview } }= await reviewApi.deleteReview(userReview._id);

            if (deletedReview) {
                $(`#deleteConfirm`).modal("hide");
                await refreshReviews();
                setStars(5);
            }

            yesBtn.removeAttribute("disabled");
            yesBtn.innerHTML = "?????ng ??";
        } catch (error) {
            yesBtn.removeAttribute("disabled");
            yesBtn.innerHTML = `
                ?????ng ?? 
            `;
        }
    };

    const handleSubmitEditReview = async (e) => {
        e.preventDefault();
        const comment = document.getElementById("comment").value;
        const btnEle = document.getElementById("editReviewBtn");

        if (!comment) return alert("Vui l??ng nh???p b??nh lu???n cho ????nh gi?? c???a b???n");

        try {
            btnEle.setAttribute("disabled", true);
            btnEle.innerHTML = `
                <span class="spinner-border spinner-border-sm"></span>
                ??ang g???i... 
            `;

            const {data: { review }} = await reviewApi.editReview(
                userReview._id,
                comment,
                stars
            );

            await refreshReviews();

            btnEle.removeAttribute("disabled");
            btnEle.innerHTML = `
                Ch???nh s???a 
            `;

            if (!review) return alert("C?? l???i x???y ra, vui l??ng th??? l???i sau");

            setIsEditing(false);
        } catch (error) {
            console.log(error);
            btnEle.removeAttribute("disabled");
            btnEle.innerHTML = `
                Ch???nh s???a
            `;
        }
    };

    const handleSort = async (e) => {
        const value = e.target.value;

        try {
            const query = `
                query($slug: String!, $sort: [String]!) {
                    reviewList: getReviewsByProductSlug(slug: $slug, sort: $sort) {
                        reviews {
                            _id
                            user {
                                username
                            }
                            comment
                            stars
                            createdAt
                        }
                        userReview {
                            _id
                            user {
                                username
                            }
                            comment
                            stars
                            createdAt
                        }
                    }
                }
            `;

            const variables = {
                slug: `${slug}`,
                sort: [value],
            };

            const { data } = await axios({
                method: "POST",
                url: "/api/query",
                headers: {
                    "Content-Type": "application/json",
                },
                data: {
                    query,
                    variables,
                },
            });

            return setReviews(data.reviewList.reviews);
        } catch {
            return undefined;
        }
    };

    const addToCart = async () => {
        try {
            const btnEle = document.getElementById("addToCartBtn");
            btnEle.setAttribute("disabled", true);
            btnEle.innerHTML = `
                <span class="spinner-border spinner-border-sm"></span>
                &nbsp; Th??m v??o gi??? h??ng
            `;

            const mutation = `
                mutation($cartId: ID!, $newItem: CartItemInput!) {
                    cart: addItemToCart(
                        cartId: $cartId,
                        newItem: $newItem
                    ) {
                        _id
                        items {
                            _id
                        }
                    }
                }
            `;

            const variables = {
                cartId: localStorage.getItem("cartId"),
                newItem: {
                    product: product._id,
                    qty: 1,
                    color: selectedColor,
                },
            };

            const { data } = await axios({
                method: "POST",
                url: "/api/mutation",
                headers: {
                    "Content-Type": "application/json",
                },
                data: {
                    mutation,
                    variables,
                },
            });

            localStorage.setItem("cartId", data.cart._id);
            localStorage.setItem("cartItems", data.cart.items.length);
            setReload(data.cart.items.length);

            btnEle.removeAttribute("disabled");
            btnEle.innerHTML = `
                <i class="fa fa-cart-plus" aria-hidden="true"></i>
                &nbsp; Th??m v??o gi??? h??ng
            `;
        } catch (error) {
            console.log(error);
        }
    };

    const loadMore = (e) => {
        e.preventDefault();
        setDisplayNumber(displayNumber + 10);
    };

    const handleSelectStars = (event, i) => {
        setStars(i);
    };

    const displayStars = (stars) => {
        const result = [];

        for (let i = 1; i <= stars; i++)
            result.push(
                <i
                    className="fas fa-star checked"
                    aria-hidden="true"
                    onClick={(event) => handleSelectStars(event, i)}
                />
            );

        for (let i = Math.floor(stars) + 1; i <= 5; i++)
            result.push(
                <i
                    className="far fa-star checked"
                    aria-hidden="true"
                    onClick={(event) => handleSelectStars(event, i)}
                />
            );

        return result;
    };

    function selectVersions(id) {
        var versions = document.querySelectorAll(`#${id} .version`);

        for (let i = 0; i < versions.length; i++) {
            versions[i].onclick = function () {
                document
                    .querySelector(`#${id} .version.active`)
                    .classList.remove("active");
                this.classList.add("active");
            };
        }
    }

    const flickityOptions = {
        freeScroll: false,
        wrapAround: false,
        draggable: true,
        prevNextButtons: false,
        pageDots: false,
    };

    const [flkty, setFlkty] = useState();
    useEffect(() => {
        var thumbnails = document.getElementsByClassName("thumbnail");
        if (flkty) {
            flkty.on("change", function (index) {
                document.querySelector(".thumbnail.active").classList.remove("active");
                thumbnails[index].classList.add("active");
            });

            for (let i = 0; i < thumbnails.length; i++) {
                thumbnails[i].onclick = function () {
                    document.querySelector(".thumbnail.active").classList.remove("active");
                    this.classList.add("active");
                    flkty.select(i, true, false);
                };
            }

        }
    });

    const reviewTab = useRef();
    const handleScroll = () => {
        reviewTab.current.click();
    };

    useEffect(() => {
        selectVersions("colors");
    }, []);
    const handleBuyNow = async () => {
        try {
            const btnEle = document.getElementById("buyNowBtn");
            btnEle.setAttribute("disabled", true);
            btnEle.innerHTML = `
            <span class="spinner-border spinner-border-sm"></span>
            &nbsp; ??ang x??? l??
        `;

            const mutation = `
            mutation($cartId: ID!, $newItem: CartItemInput!) {
                cart: addItemToCart(
                    cartId: $cartId,
                    newItem: $newItem
                ) {
                    _id
                    items {
                        _id
                    }
                }
            }
        `;

            const variables = {
                cartId: localStorage.getItem("cartId"),
                newItem: {
                    product: product._id,
                    qty: 1,
                    color: selectedColor,
                },
            };

            const { data } = await axios({
                method: "POST",
                url: "/api/mutation",
                headers: {
                    "Content-Type": "application/json",
                },
                data: {
                    mutation,
                    variables,
                },
            });

            localStorage.setItem("cartId", data.cart._id);
            localStorage.setItem("cartItems", data.cart.items.length);
            setReload(data.cart.items.length);

            btnEle.removeAttribute("disabled");
            btnEle.innerHTML = `
            <i class="fa fa-cart-plus" aria-hidden="true"></i>
            &nbsp; Mua ngay
        `;
        } catch (error) {
            console.log(error);
        }
        router.push("/gio-hang");
    };

    const addToWishList = async (productId) => {
        try {
            if (!isSignedIn)
                return router.push("/dang-nhap");
            const btnWL = document.getElementById("btnAddToWishList");
            btnWL.setAttribute("disabled", true);
            btnWL.innerHTML = `
                <span class="spinner-border spinner-border-sm"></span>
                &nbsp; ??ang th??m v??o s???n ph???m y??u th??ch
            `;

            const client = graphqlClient(jwt);

            const { dataWL } = await client.mutate({
                mutation: gql`
          mutation addProductToWishList($productId: ID!) {
            addProductToWishList(productId: $productId)
          }
        `,
                variables: {
                    productId: productId,
                },
            });

            btnWL.removeAttribute("disabled");
            btnWL.innerHTML = `
                <i class="fa fa-heart" aria-hidden="true"></i>
                &nbsp ???? th??m v??o y??u th??ch
            `;
        } catch (error) {
            console.log(error);
        }
    };
    const checkProductInWishList = async (productId) => {
        try {
            const client = graphqlClient(jwt);

            const { data } = await client.query({
                query: gql`
          query checkProductInWishList($productId: ID!) {
            checkProductInWishList(productId: $productId)
          }
        `,
                variables: {
                    productId: productId,
                },
            });
            const btnAddToWishList = document.getElementById("btnAddToWishList");
            if (data.checkProductInWishList == true) {
                btnAddToWishList.innerHTML = `
          <i class="fas fa-heart" aria-hidden="true"></i>
          &nbsp;???? th??m v??o s???n ph???m y??u th??ch
        `;
                btnAddToWishList.setAttribute("disabled", true);
            }
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(async () => {
        console.log("Ket qua ne");
        console.log(await checkProductInWishList(product.id));
    }, [])

    return (
        <>
            <Head>
                <title>{product.name}</title>
            </Head>
            <Header />
            <div className="bodyIndex" id="root">
                <article className="container product-details bg-white border">
                    <nav className="breadcrumb breadcrumb--custom mb-1">
                        <div className="container px-0">
                            <a className="breadcrumb-item d-inline-block" href="/">
                                Trang ch???
                            </a>
                            <a className="breadcrumb-item d-inline-block" href="/san-pham">
                                C???a h??ng
                            </a>
                            <span className="breadcrumb-item  d-inline-block active">
                                {product.name}
                            </span>
                        </div>
                    </nav>

                    <section className="row mx-0 py-2">
                        <h1 className="col-12 col-lg-6 product-details__name">
                            {product.name}
                        </h1>
                        <div className="col-12 col-lg-6 product-details__rating">
                            <span className="rating-result mr-3">
                                <RatingStars stars={overviews.average} />
                            </span>
                            <span>
                                {overviews.total} ????nh gi?? |{" "}
                                <a href="#menuTab" onClick={handleScroll}>
                                    Nh???n x??t ngay
                                </a>
                            </span>
                        </div>
                    </section>
                    <section className="row mx-0">
                        <div className="product-details__images px-0 px-md-2 col-12 col-lg-4 col-xl-4 mb-3 ">
                            <Flickity
                                className={"product-images__slide mb-2"}
                                elementType={"div"}
                                options={flickityOptions}
                                reloadOnUpdate
                                static
                                flickityRef={c => setFlkty(c)}
                            // flickityRef={flkty}
                            >
                                {largePic()}
                            </Flickity>
                            <div className="product-images__thumbnails px-4">{thumbs()}</div>
                        </div>
                        <div className="px-0 px-md-2 col-12 col-lg-4 col-xl-4 mb-3">
                            <div className="product-details__price">
                                {product.salesPercentage === 0 ? null : (
                                    <span className="sales-price">{finalPrice} ??? </span>
                                )}
                                <span className="regular-price">{regularPrice} ???</span>
                            </div>
                            <p className="my-2">
                                <b>Ch???n m??u ph?? h???p</b>
                            </p>
                            <div className="product-details__versions" id="colors">
                                {colorOption()}
                            </div>
                            <p className="my-2">
                                <b>Khuy???n m??i: </b>
                                <ul
                                    className="product-details__bonus"
                                    dangerouslySetInnerHTML={{
                                        __html: product.promotion,
                                    }}
                                ></ul>
                            </p>
                            <div className="row px-0 mx-0">
                                <button
                                    className="btn btn--buy-now col-12 px-0 mb-2"
                                    id="buyNowBtn"
                                    onClick={handleBuyNow}
                                >
                                    <i
                                        className="fa fa-cart-arrow-down fa--md"
                                        aria-hidden="true"
                                    />
                                    &nbsp; Mua ngay
                                </button>
                                <div className="col-6 pl-0 pr-1">
                                    <button
                                        className="btn btn-success w-100"
                                        id="addToCartBtn"
                                        onClick={addToCart}
                                    >
                                        <i className="fa fa-cart-plus" aria-hidden="true" />
                                        &nbsp; Th??m v??o gi??? h??ng
                                    </button>
                                </div>
                                <div className="col-6 pr-0 pl-1">
                                    <button
                                        className=" btn btn-primary w-100 "
                                        id="btnAddToWishList"
                                        onClick={() => addToWishList(idProduct)}
                                    >
                                        <i className="fa fa-heart" aria-hidden="true" />
                                        &nbsp; Th??m v??o s???n ph???m y??u th??ch
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="px-0 px-md-2 col-12 col-lg-4 col-xl-4 mb-3">
                            <div className="mt-2">
                                <b>T??nh tr???ng</b>
                                <br />
                                {product.condition === null ? (
                                    <span className="text-justify">
                                        M??y m???i 100%, nguy??n h???p, ?????y ????? ph??? ki???n t??? nh?? s???n xu???t.
                                    </span>
                                ) : (
                                    <div
                                        className="text-justify"
                                        dangerouslySetInnerHTML={{
                                            __html: product.condition,
                                        }}
                                    ></div>
                                )}
                            </div>
                            <div className="mt-2">
                                <b>H???p bao g???m</b>
                                <br />
                                <ul
                                    className="text-justify list-unstyled"
                                    dangerouslySetInnerHTML={{
                                        __html: product.inclusionBox,
                                    }}
                                ></ul>
                            </div>
                            <div className="mt-2">
                                <b>B???o h??nh</b>
                                <br />
                                <ul
                                    className="text-justify"
                                    dangerouslySetInnerHTML={{
                                        __html: product.warranty,
                                    }}
                                    style={{ listStyleType: "none" }}
                                ></ul>
                            </div>
                        </div>
                    </section>
                </article>
                <article className="container row mx-auto px-0" id="menuTab">
                    <div className="col-12 col-lg-8 bg-white bd-top--fake-bg px-0">
                        <div>
                            <ul
                                className="nav--custom nav nav-pills my-2"
                                id="pills-tab"
                                role="tablist"
                            >
                                <li className="nav-item" role="presentation">
                                    <a
                                        className="nav-link"
                                        id="pills-home-tab"
                                        data-toggle="pill"
                                        href="#pills-desc"
                                        role="tab"
                                        aria-controls="pills-desc"
                                        aria-selected="true"
                                    >
                                        M?? t???
                                    </a>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <a
                                        className="nav-link"
                                        id="pills-profile-tab"
                                        data-toggle="pill"
                                        href="#pills-specification"
                                        role="tab"
                                        aria-controls="pills-specification"
                                        aria-selected="false"
                                    >
                                        Th??ng s???
                                    </a>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <a
                                        className="nav-link"
                                        id="pills-contact-tab"
                                        data-toggle="pill"
                                        href="#pills-reviews"
                                        role="tab"
                                        aria-controls="pills-reviews"
                                        aria-selected="false"
                                        ref={reviewTab}
                                    >
                                        ????nh gi??
                                    </a>
                                </li>
                            </ul>
                            <div className="tab-content container" id="pills-tabContent">
                                <div
                                    className="tablist_content tab-pane fade show active"
                                    id="pills-desc"
                                    role="tabpanel"
                                    aria-labelledby="pills-desc-tab"
                                    dangerouslySetInnerHTML={{
                                        __html: product.fullDesc,
                                    }}
                                ></div>

                                <div
                                    className="tablist_content tab-pane fade"
                                    id="pills-specification"
                                    role="tabpanel"
                                    aria-labelledby="pills-specification-tab"
                                >
                                    <h4>Th??ng s??? k??? thu???t chi ti???t {product.name}</h4>
                                    <img
                                        src={
                                            process.env.NEXT_PUBLIC_API_URL + product.thumbnail.url
                                        }
                                        className="img_product img_product-specification"
                                        alt=""
                                    />
                                    <table className="table table-specification">
                                        <thead>
                                            <tr>
                                                <th colSpan={2}>K??ch th?????c</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td scope="row">Chi???u d??i</td>
                                                <td>{product.height}mm</td>
                                            </tr>
                                            <tr>
                                                <td scope="row">Chi???u r???ng</td>
                                                <td>{product.width}mm</td>
                                            </tr>
                                            <tr>
                                                <td scope="row">????? d??y</td>
                                                <td>{product.depth}mm</td>
                                            </tr>
                                        </tbody>
                                        <thead>
                                            <tr>
                                                <th colSpan={2}>M??n h??nh</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td scope="row">K??ch th?????c m??n h??nh</td>
                                                <td>{product.screenSize}</td>
                                            </tr>
                                            <tr>
                                                <td scope="row">C??ng ngh??? m??n h??nh</td>
                                                <td>{product.screenPanel}</td>
                                            </tr>
                                            <tr>
                                                <td scope="row">????? ph??n gi???i</td>
                                                <td>{product.screenResolution}</td>
                                            </tr>
                                        </tbody>
                                        <thead>
                                            <tr>
                                                <th colSpan={2}>N???n t???ng</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td scope="row">H??? ??i???u h??nh</td>
                                                <td>{product.platformName}</td>
                                            </tr>
                                            <tr>
                                                <td scope="row">Phi??n b???n</td>
                                                <td>{product.platformVersion}</td>
                                            </tr>
                                        </tbody>
                                        <thead>
                                            <tr>
                                                <th colSpan={2}>C???u h??nh</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td scope="row">CPU</td>
                                                <td>{product.cpu}</td>
                                            </tr>
                                            <tr>
                                                <td scope="row">GPU</td>
                                                <td>{product.gpu}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div
                                    className="customer-reviews tablist_content tab-pane fade"
                                    id="pills-reviews"
                                    role="tabpanel"
                                    aria-labelledby="pills-reviews-tab"
                                >
                                    {displayOverviews()}

                                    {displayReviewingForm()}

                                    {displayReviews()}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-4 bg-white bd-top-left--fake-bg">
                        <h2 className="title text-center my-3">S???n ph???m li??n quan</h2>
                        <div className="related-products row mx-0 pb-3">
                            {relatedProduct}
                        </div>
                    </div>
                </article>

                <form action className="search-bar" id="search-bar">
                    <input
                        type="text"
                        name="seach"
                        id="seach"
                        className="search-input"
                        placeholder="Search"
                    />
                    <button type="submit" className="btn btn--search">
                        <i className="fa fa-search " aria-hidden="true" />
                    </button>
                </form>
                <div id="overlaybody" />
            </div>
            <Footer />
            {/* <!-- Optional JavaScript --> */}
            <script src="/vendors/flickity.pkgd.min.js"></script>
        </>
    );
}
