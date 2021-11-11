
import React from 'react';

export default function page({ productsPerPage, paginate, currentPage, products, filter }) {

    const productsFilter = () => {
        // filter brand
        if (filter.brand === "0" || filter.price === "0" || filter.ram === "0" || filter.rom === "0")
            products = (products)
        if (filter.brand != "0")
            products = (products.filter(product => product.brand.slug === filter.brand))
        // filter price
        if (filter.price === "duoi-5-trieu")
            products = (products.filter(product => product.finalPrice <= 5000000))
        else if (filter.price === "tu-5-den-10-trieu")
            products = (products.filter(product => product.finalPrice >= 5000000 && product.finalPrice <= 10000000))
        else if (filter.price === "tu-10-den-15-trieu")
            products = (products.filter(product => product.finalPrice >= 10000000 && product.finalPrice <= 15000000))
        else if (filter.price === "tren-15-trieu")
            products = (products.filter(product => product.finalPrice >= 15000000))
        // filter ram
        if (filter.ram === "duoi-4")
            products = (products.filter(product => product.ram <= 4))
        else if (filter.ram === "4-den-6")
            products = (products.filter(product => product.ram >= 4 && product.ram <= 6))
        else if (filter.ram === "tren-8")
            products = (products.filter(product => product.ram >= 8))
        // filter rom
        if (filter.rom === "duoi-32")
            products = (products.filter(product => product.rom <= 32))
        else if (filter.rom === "32-den-64")
            products = (products.filter(product => product.rom >= 32 && product.rom <= 64))
        else if (filter.rom === "128-den-256")
            products = (products.filter(product => product.rom >= 128 && product.rom <= 256))
        else if (filter.rom === "tren-512")
            products = (products.filter(product => product.rom >= 512))

        return products.length
    }

    const pageNumbers = [];
    const totalPages = Math.ceil(productsFilter() / productsPerPage)

    for (let index = 1; index <= totalPages; index++) {
        pageNumbers.push(index);
    }

    return (
        <>
            <ul className="pagination pagination--custom my-3 justify-content-center">
                <li className={currentPage <= 1 ? "page-item disabled" : "page-item"}>
                    <a onClick={() => paginate(currentPage - 1)} href="#!" className="page-link">
                        Previos
                    </a>
                </li>
                {pageNumbers.map((number) => (
                    <li className={currentPage === number ? "page-item active" : "page-item"}>
                        <a onClick={() => paginate(number)} href="#!" className="page-link">
                            {number}
                        </a>
                    </li>
                ))}
                <li className={currentPage >= totalPages ? "page-item disabled" : "page-item"}>
                    <a onClick={() => paginate(currentPage + 1)} href="#!" className="page-link">
                        Next
                    </a>
                </li>
            </ul>
        </>

    )
}

