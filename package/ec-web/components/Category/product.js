import Link from 'next/link'
import { useEffect } from 'react'

const pro = ({ currentProducts, filter, products }) => {
    const productsFilter = () => {
        // filter brand
        if (filter.brand === "0" || filter.price === "0" || filter.ram === "0" || filter.rom === "0")
            currentProducts = (currentProducts)
        if (filter.brand != "0")
            currentProducts = (products.filter(product => product.brand.slug === filter.brand))
        // filter price
        if (filter.price === "duoi-5-trieu")
            currentProducts = (products.filter(product => product.finalPrice <= 5000000))
        else if (filter.price === "tu-5-den-10-trieu")
            currentProducts = (products.filter(product => product.finalPrice >= 5000000 && product.finalPrice <= 10000000))
        else if (filter.price === "tu-10-den-15-trieu")
            currentProducts = (products.filter(product => product.finalPrice >= 10000000 && product.finalPrice <= 15000000))
        else if (filter.price === "tren-15-trieu")
            currentProducts = (products.filter(product => product.finalPrice >= 15000000))
        // filter ram
        if (filter.ram === "duoi-4")
            currentProducts = (products.filter(product => product.ram <= 4))
        else if (filter.ram === "4-den-6")
            currentProducts = (products.filter(product => product.ram >= 4 && product.ram <= 6))
        else if (filter.ram === "tren-8")
            currentProducts = (products.filter(product => product.ram >= 8))
        // filter rom
        if (filter.rom === "duoi-32")
            currentProducts = (products.filter(product => product.rom <= 32))
        else if (filter.rom === "32-den-64")
            currentProducts = (products.filter(product => product.rom >= 32 && product.rom <= 64))
        else if (filter.rom === "128-den-256")
            currentProducts = (products.filter(product => product.rom >= 128 && product.rom <= 256))
        else if (filter.rom === "tren-512")
            currentProducts = (products.filter(product => product.rom >= 512))

        return currentProducts
    }

    const displayStars = (stars) => {
        const result = [];
        for (let index = 0; index < stars; index++) {
            result.push(
                <i className="fa product__rating-icon fa-star" aria-hidden="true"></i>
            )
        }
        if ((stars - Math.floor(stars)) > 0) {
            result.push(
                <i className="fa product__rating-icon fa-star-half" aria-hidden="true"></i>
            )
        }
        for (let index = result.length; index < 5; index++) {
            result.push(
                <i className="fa product__rating-icon fa-star-o" aria-hidden="true"></i>
            )
        }
        return result;
    }

    const productsResult = productsFilter()

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

    var product = productsResult.map((product, index) => {
        const regularPrice = product.regularPrice.toLocaleString("DE-de");
        const finalPrice = product.finalPrice.toLocaleString("DE-de");

        return (
            <div className="product">
                <img src={process.env.NEXT_PUBLIC_API_URL + product.thumbnail.url} alt="" className="product__img mb-4" style={{ maxHeight: "204px", maxWidth: "204px" }} />
                <span className="product__title">
                    <Link href="/san-pham/[slug]" as={`/san-pham/${product.slug}`}>
                        {product.name}
                    </Link>
                    <span className="hovercard">
                        <div className="tooltiptext">
                            <table className="table">
                                <thead className="thead-dark">
                                    <tr>
                                        <th colSpan={2}>Màn hình</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td scope="row">Kích thước màn hình</td>
                                        <td>{product.screenSize}</td>
                                    </tr>
                                    <tr>
                                        <td scope="row">Công nghệ màn hình</td>
                                        <td>{product.screenPanel}</td>
                                    </tr>
                                    <tr>
                                        <td scope="row">Độ phân giải</td>
                                        <td>{product.screenResolution}</td>
                                    </tr>
                                </tbody>
                                <thead className="thead-dark">
                                    <tr>
                                        <th colSpan={2}>Cấu hình</th>
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
                    </span>
                </span>
                <div className="product__price">
                    {product.salesPercentage === 0 ?
                        null :
                        <span className="sales-price">
                            {finalPrice}₫
                        </span>
                    }

                    <span className="regular-price">{regularPrice}₫</span>
                </div>
                <div className="product__rating">
                    {displayStars(product.stars)}
                    <span>({product.votes} đánh giá)</span>
                </div>
                {product.salesPercentage === 0 ?
                    "" :
                    <div className="product__box-sticker">
                        <p className="sticker-percent">
                            -{product.salesPercentage}%
                        </p>
                    </div>
                }

            </div>
        )
    })
    return (
        <>
            {product}
        </>
    );
}

export default pro