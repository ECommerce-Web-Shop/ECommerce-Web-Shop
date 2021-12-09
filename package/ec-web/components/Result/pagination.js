
import React from 'react';

export default function page({ productsPerPage, totalProducts, paginate, currentPage }) {

    const pageNumbers = [];
    const totalPages = Math.ceil(totalProducts / productsPerPage)

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

