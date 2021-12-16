import Head from 'next/head'
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Banner from '../../components/Banner/Banner';
import { useState, useEffect } from 'react';
import Pagination from '../../components/Result/pagination';
import Product from '../../components/Result/product';
import client from '../../components/Category/apolloClient'
import { gql } from '@apollo/client';
import { useRouter } from "next/router"

export async function getServerSideProps({ query }) {
    query.minPrice = Number(query.minPrice);
    query.maxPrice = Number(query.maxPrice);
    query.minRam = Number(query.minRam);
    query.maxRam = Number(query.maxRam);
    query.minScreenSize = Number(query.minScreenSize);
    query.maxScreenSize = Number(query.maxScreenSize);
    query.minBatteryCapacity = Number(query.minBatteryCapacity);
    query.maxBatteryCapacity = Number(query.maxBatteryCapacity);


    
        const { data } = await client.query({
            query: gql`
            query($filter: ProductFilter!) {
                products: searchProducts(filter: $filter){
                    name,
                    salesPercentage,
                    slug,
                    regularPrice,
                    finalPrice,
                    id,
                    ram,
                    thumbnail{
                        url
                    },
                    brand{
                        name
                    }
                    screenSize
                    screenPanel
                    screenResolution
                    cpu
                    gpu
                }
            }
        `,
            variables: {
                "filter": query
            }
        });
    // try {
        return {
            props: {
                products: data.products,
                // products: [],
            },
    //     };
    // } catch {
    //         return {
    //             redirect: {
    //                 destination: '/',
    //                 permanent: false,
    //             },
    //         }
    // }


}
}
export default function Result({ products }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(25);

    const indexOfLastProduct = productsPerPage * currentPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    const paginate = pageNumber => (setCurrentPage(pageNumber))

    useEffect(() => {
        // Hide all hovercar first time
        $(".hovercard").hide();

        $(".product__title").hover(
            function () {
                const elems = this;
                const curClass = elems.className; // current class clicked.
                const windowHeight = $(window).height();
                const windowWidth = $(window).width();

                const left = elems.offsetLeft;
                const top = elems.offsetTop;
                const linkHeight = $(this).height();
                const linkWidth = $(this).width();
                const bottom = windowHeight - top - linkHeight;
                const right = windowWidth - left - linkWidth;
                const topbottom = top < bottom ? bottom : top;
                const leftright = left < right ? right : left;

                const tooltiph = $(this).find(".hovercard").height();
                const tooltipw = $(this).find(".hovercard").width();

                if (topbottom == bottom && leftright == right) {
                    var yPos = top + 45;
                    var xPos = left + linkWidth + 10;
                    $(this).find(".hovercard").css("top", yPos + "px");
                    $(this).find(".hovercard").css("left", xPos + "px");
                }

                if (topbottom == bottom && leftright == left) {
                    //done
                    var yPos = top + 45;
                    var xPos = right + linkWidth + 10;
                    $(this).find(".hovercard").css("top", yPos + "px");
                    $(this).find(".hovercard").css("right", xPos + "px");
                }

                if (topbottom == top && leftright == right) {
                    //done
                    var xPos = left + linkWidth + 10;
                    var yPos = top - tooltiph - linkHeight / 2 - 45;
                    $(this).find(".hovercard").css("top", yPos + "px");
                    $(this).find(".hovercard").css("left", xPos + "px");
                }

                if (topbottom == top && leftright == left) {
                    var yPos = top - tooltiph - linkHeight / 2;
                    var xPos = left - tooltipw - linkWidth - 45;
                    $(this).find(".hovercard").css("top", yPos + "px");
                    $(this).find(".hovercard").css("left", xPos + "px");
                }

                $(this).find(".hovercard").fadeIn("fast");
            },

            function () {
                $(this).find(".hovercard").fadeOut("fast");
            }
        );
    });

    return (
        <>
            <Head>
                <title>Kết quả tìm kiếm</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" key="title" />
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
                {/* <!-- Bootstrap CSS --> */}
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossOrigin="anonymous" />
                <link rel="stylesheet" href="./vendors/flickity.min.css" />
                {/* <!-- Optional CSS --> */}
                <link rel="stylesheet" href="./css/style.css" />
            </Head>
            <Header></Header>
            <div id="root">
                <Banner />

                <div className="container bg-white mb-5 filter py-3">
                    {/* <i><h1 className="text-center text-primary">Kết quả tìm kiếm</h1></i> */}
                    <div className="product-list product-list--non-slide border-0">
                        <Product currentProducts={currentProducts} />
                    </div>
                    <Pagination
                        productsPerPage={productsPerPage}
                        totalProducts={products.length}
                        paginate={paginate}
                        currentPage={currentPage}
                    />
                </div>
                <Footer />
            </div>

            {/* <!-- Optional JavaScript --> */}
            <script src="./vendors/flickity.pkgd.min.js"></script>
            <script src="./js/main.js"></script>
            {/* <script src=""></script> */}
            {/* <!-- jQuery first, then Popper.js, then Bootstrap JS --> */}
            <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossOrigin="anonymous"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossOrigin="anonymous"></script>
            <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossOrigin="anonymous"></script>
        </>
    );
}