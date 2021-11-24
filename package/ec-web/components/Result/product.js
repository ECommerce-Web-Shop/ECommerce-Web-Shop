import Link from 'next/link'

const pro = ({ currentProducts }) => {

    const products = currentProducts

    var product = products.map((product, index) => {
        const regularPrice = product.regularPrice.toLocaleString("DE-de");
        const finalPrice = product.finalPrice.toLocaleString("DE-de");

        return (
            <div className="product">
                <img src={process.env.NEXT_PUBLIC_API_URL + product.thumbnail.url} alt="" className="product__img mb-4" style={{ maxHeight: "204px", maxWidth: "204px" }} />
                <span className="product__title">
                    <Link href="/san-pham/[slug]" as={`/san-pham/${product.slug}`}>
                       <a>{product.name}</a> 
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
                    <i className="fa product__rating-icon fa-star" aria-hidden="true"></i>
                    <i className="fa product__rating-icon fa-star" aria-hidden="true"></i>
                    <i className="fa product__rating-icon fa-star" aria-hidden="true"></i>
                    <i className="fa product__rating-icon fa-star" aria-hidden="true"></i>
                    <i className="fa product__rating-icon  fa-star-half" aria-hidden="true"></i>
                    <span>(442 đánh giá)</span>
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