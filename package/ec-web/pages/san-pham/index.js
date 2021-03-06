import Head from 'next/head'
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Banner from '../../components/Banner/Banner';
import { useState } from 'react';
import Pagination from '../../components/Category/pagination';
import Product from '../../components/Category/product';
import client from '../../components/Category/apolloClient'
import getProductsQuery from '../../components/Category/getProductsQuery'

export async function getServerSideProps() {
    const { data } = await client.query({
        query: getProductsQuery(),
    });

    return {
        props: {
            products: data.products,
        },
    };
}

export default function Category({ products }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(15);
    
    const [filter, setFilter] = useState({
        brand: "0",
        price: "0",
        ram: "0",
        rom: "0"
    });

    const indexOfLastProduct = productsPerPage * currentPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
     
    const paginate = pageNumber => (setCurrentPage(pageNumber))

    let isExist = (arr, x) => arr.includes(x);

    const brandNames = [];

    products.map(product => {
        if (!isExist(brandNames, product.brand.name))
            brandNames.push(product.brand.name)
    })

    const handleFilterBrand = (e) => {
        setFilter({...filter, brand: e.target.value});
    }

    const handleFilterPrice = (e) => {
        setFilter({...filter, price: e.target.value})
    }

    const handleFilterRam = (e) => {
        setFilter({...filter, ram: e.target.value})
    }

    const handleFilterRom = (e) => {
        setFilter({...filter, rom: e.target.value})
    }

    const brandName = brandNames.map((name) => (
        <option value={String(name).toLowerCase()} type="button">
               {name}
        </option>
    ))
    
    return (
        <>
            <Head>
                <title>S???n ph???m</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" key="title" />
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
                {/* <!-- Bootstrap CSS --> */}
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossOrigin="anonymous" />
                <link rel="stylesheet" href="./vendors/flickity.min.css" />
                {/* <!-- Optional CSS --> */}
                <link rel="stylesheet" href="./css/style.css" />
            </Head>
            <Header></Header>
            <div id="body">
                <div id="root">
                    <Banner />
                    <hr />
                    <div className="container">
                        <div className="bg-white mb-5 filter p-3">
                            <div className="filterBar d-block py-3 row container-fluid">
                                <select className="filter__option mr-2 my-2 col-3" onChange={handleFilterBrand}>
                                    <option value="0" selected>H??ng...</option>
                                    {brandName}
                                </select>

                                <select className="filter__option mr-2 my-2 col-3" onChange={handleFilterPrice}>
                                    <option value="0" selected>Gi??...</option>
                                    <option value="duoi-5-trieu">D?????i 5 tri???u</option>
                                    <option value="tu-5-den-10-trieu">T??? 5 ?????n 10 tri???u</option>
                                    <option value="tu-10-den-15-trieu">T??? 10 ?????n 15 tri???u</option> 
                                    <option value="tren-15-trieu">Tr??n 15 tri???u</option>
                                </select>

                                <select className="filter__option mr-2 my-2 col-2" onChange={handleFilterRam}>
                                    <option value="0" selected>Ram...</option>
                                    <option value="duoi-4">D?????i 4 GB</option>
                                    <option value="4-den-6">4 - 6 GB</option>
                                    <option value="tren-8">8 GB tr??? l??n</option>

                                </select>
                                <select className="filter__option mr-2 my-2 col-3" onChange={handleFilterRom}>
                                    <option value="0" selected>B??? nh??? trong...</option>
                                    <option value="duoi-32">D?????i 32 GB</option>
                                    <option value="32-den-64">32 - 64 GB</option>
                                    <option value="128-den-256">128 - 256 GB</option>
                                    <option value="tren-512">512 GB tr??? l??n</option>
                                </select>
                            </div>
                            <div className="product-list product-list--non-slide border-0">
                                <Product currentProducts={currentProducts} filter={filter} products={products}/>
                            </div>
                            <Pagination
                                productsPerPage={productsPerPage}
                                paginate={paginate}
                                currentPage={currentPage}
                                products={products}
                                filter={filter}
                            />
                        </div>
                    </div>
                    <Footer />
                </div>
                <form action="" className="search-bar" id="search-bar">
                    <input type="text" name="seach" id="seach" className="search-input" placeholder="Search" />
                    <button type="submit" className="btn btn--search">
                        <i className="fa fa-search " aria-hidden="true"></i>
                    </button>
                </form>

                <div id="overlaybody"></div>
                {/* <!-- Optional JavaScript --> */}
                <script src="./vendors/flickity.pkgd.min.js"></script>
            </div>
        </>
    );
}