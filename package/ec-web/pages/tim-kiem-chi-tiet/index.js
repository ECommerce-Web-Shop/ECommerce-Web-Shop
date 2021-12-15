import Head from 'next/head'
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Banner from '../../components/Banner/Banner';
import { useRouter } from 'next/router';

import client from '../../components/Category/apolloClient'
import getProductsQuery from '../../components/AdvancedSearch/filterProductsQuery'
import { useState, useEffect } from 'react';
import Link from 'next/link';

export async function getServerSideProps() {
    const { data } = await client.query({
        query: getProductsQuery(),
    });

    return {
        props: {
            products: data.products,
            // params: 
        },
    };
}

export default function Index({ products }) {
    let isExist = (arr, x) => arr.includes(x);
    const router = useRouter();

    const [brandNameList, setBrandNameList] = useState([]);
    const [platformNameList, setPlatformNameList] = useState([]);
    const [screenPanelList, setScreenPanelList] = useState([]);
    const [maxPrice, setMaxPrice] = useState(null);
    const [minPrice, setMinPrice] = useState(null);
    const [minRam, setMinRam] = useState(null);
    const [maxRam, setMaxRam] = useState(null);
    const [minScreenSize, setMinScreenSize] = useState(null);
    const [maxScreenSize, setMaxScreenSize] = useState(null);
    const [minBatteryCapacity, setMinBatteryCapacity] = useState(null);
    const [maxBatteryCapacity, setMaxBatteryCapacity] = useState(null);


    products.map(product => {
        // thêm tên hãng
        if (!isExist(brandNameList, product.brand.name))
            setBrandNameList([...brandNameList, product.brand.name])
        // thêm tên hệ điều hành
        if (!isExist(platformNameList, product.platformName))
            setPlatformNameList([...platformNameList, product.platformName])
        // thêm loại màn hình
        if (!isExist(screenPanelList, product.screenPanel))
            setScreenPanelList([...screenPanelList, product.screenPanel])
    })

    const brandName = brandNameList.map((name) => (
        <option value={name} type="button">
            {name}
        </option>
    ))

    const platformName = platformNameList.map((platformName) => (
        <option value={platformName} type="button">
            {platformName}
        </option>
    ))

    const screenPanelName = screenPanelList.map((screenPanelName) => (
        <option value={screenPanelName} type="button">
            {screenPanelName}
        </option>
    ))

    let query = {};

    const handleSearch = e => {
        e.preventDefault();
        // sessionStorage.clear();
        const brand = document.getElementById('brand').value;
        const platform = document.getElementById('platform').value;  
        const screenPanel = document.getElementById('screenPanel').value;  
        
        if (brand)
            query.brand = brand;

        if (platform)
            query.platform = platform;

        if (minPrice)
            query.minPrice = minPrice;

        if (maxPrice)
            query.maxPrice = maxPrice;

        if (minRam)
            query.minRam = minRam;

        if (maxRam)
            query.maxRam = maxRam;

        if (screenPanel)
            query.screenPanel = screenPanel;

        if (minScreenSize)
            query.minScreenSize = minScreenSize;

        if (maxScreenSize)
            query.maxScreenSize = maxScreenSize;

        if (minBatteryCapacity)
            query.minBatteryCapacity = minBatteryCapacity;

        if (maxBatteryCapacity)
            query.maxBatteryCapacity = maxBatteryCapacity;

        // localStorage.setItem('query', JSON.stringify(query))

        router.push({
            pathname: '/ket-qua-tim-kiem',
            query: query
        })
    };

    const handlePrice = e => {
        const value = e.target.value;
        sessionStorage.setItem('price', value)

        switch (value) {
            case '0':
                setMinPrice(null);
                setMaxPrice(null);
                break;
            case 'duoi-5-trieu':
                setMinPrice(null);
                setMaxPrice(5000000);
                break;
            case 'tu-5-den-10-trieu':
                setMinPrice(5000000);
                setMaxPrice(10000000);
                break;
            case 'tu-10-den-15-trieu':
                setMinPrice(10000000);
                setMaxPrice(15000000);
                break;
            case 'tren-15-trieu':
                setMinPrice(15000000);
                setMaxPrice(null)
                break;
        }
    }

    const handleRam = e => {
        const value = e.target.value;
        sessionStorage.setItem('ram', value)

        switch (value) {
            case '0':
                setMinRam(null);
                setMaxRam(null);
                break;
            case 'duoi-4-gb':
                setMinRam(null);
                setMaxRam(4);
                break;
            case 'tu-4-den-8-gb':
                setMinRam(4);
                setMaxRam(8);
                break;
            case 'tu-8-den-12-gb':
                setMinRam(8);
                setMaxRam(12);
                break;
            case 'tren-12-gb':
                setMinRam(12);
                setMaxRam(null);
                break;
        }
    }

    const handleScreenSize = e => {
        const value = e.target.value;
        sessionStorage.setItem('screenSize', value)

        switch (value) {
            case '0':
                setMinScreenSize(null);
                setMaxScreenSize(null);
                break;
            case 'tu-6-den-6-5-inches':
                setMinScreenSize(6);
                setMaxScreenSize(6.5);
                break;
            case 'tu-6-5-den-7-inches':
                setMinScreenSize(6.5);
                setMaxScreenSize(7);
                break;
            case 'tren-7-inches':
                setMinScreenSize(7);
                setMaxScreenSize(null);
                break;
        }
    }

    const handleBatteryCapacity = e => {
        const value = e.target.value;
        sessionStorage.setItem('batteryCapacity', value)

        switch (value) {
            case '0':
                setMinBatteryCapacity(null);
                setMaxBatteryCapacity(null);
                break;
            case 'duoi-4000-mAh':
                setMinBatteryCapacity(null);
                setMaxBatteryCapacity(4000);
                break;
            case 'tu-4000-den-5000-mAh':
                setMinBatteryCapacity(4000);
                setMaxBatteryCapacity(5000);
                break;
            case 'tren-5000-mAh':
                setMinBatteryCapacity(5000);
                setMaxBatteryCapacity(null);
                break;
        }
    }

    
    const handleBrandSelect = e => {
        const brand = e.target.value;
        sessionStorage.setItem('brand', brand)
    }
    
    const handlePlatformSelect = e => {
        const platform = e.target.value;
        sessionStorage.setItem('platform', platform)
    }
    
    const handleScreenPanel = e => {
        const screenPanel = e.target.value;
        sessionStorage.setItem('screenPanel', screenPanel)
    }

    useEffect(() => {
        const brand = sessionStorage.getItem('brand');
        const platform = sessionStorage.getItem('platform');
        const price = sessionStorage.getItem('price');
        const ram = sessionStorage.getItem('ram');
        const screenPanel = sessionStorage.getItem('screenPanel'); 
        const screenSize = sessionStorage.getItem('screenSize');
        const batteryCapacity = sessionStorage.getItem('batteryCapacity');
        if (brand)
            document.getElementById('brand').value = brand;
        if (platform)
            document.getElementById('platform').value = platform;
        if (price)
            document.getElementById('price').value = price;
        if (ram)
            document.getElementById('ram').value = ram;
        if (screenPanel)
            document.getElementById('screenPanel').value = screenPanel;
        if (screenSize)
            document.getElementById('screenSize').value = screenSize;
        if (batteryCapacity)
            document.getElementById('batteryCapacity').value = batteryCapacity;

    }, []);

    return (
        <>
            <Head>
                <title>Tìm kiếm chi tiết</title>
            </Head>
            <Header />
            <Banner />
            <form action="/ket-qua-tim-kiem" method='GET' id="myForm" name="myForm">
                <div className="body_advanced container p-5" style={{ backgroundColor: '#FFFFFF' }}>
                    {/* ================================ FILTER GENERAL (Tổng quát)=============================== */}
                    <h3>Tổng quát</h3>
                    <div className="body__advanced-box row no-gutters">
                        <div className="box__item col-6 pr-2">
                            <div className="form-group">
                                <select className="form-control" name="brand" id="brand" onChange={handleBrandSelect}>
                                    <option value="">Hãng...</option>
                                    {brandName}
                                </select>
                            </div>
                        </div>
                        <div className="box__item col-6 pl-2">
                            <div className="form-group">
                                <select className="form-control" name="platform" id="platform" onChange={handlePlatformSelect}>
                                    <option value="">Hệ điều hành...</option>
                                    {platformName}
                                </select>
                            </div>
                        </div>
                        <div className="box__item col-6 pr-2">
                            <div className="form-group">
                                <select className="form-control" id="price" onChange={handlePrice}>
                                    <option value="0" selected>Giá...</option>
                                    <option value="duoi-5-trieu">Dưới 5 triệu</option>
                                    <option value="tu-5-den-10-trieu">Từ 5 đến 10 triệu</option>
                                    <option value="tu-10-den-15-trieu">Từ 10 đến 15 triệu</option>
                                    <option value="tren-15-trieu">Trên 15 triệu</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* ================================ FILTER MEMORY (Bộ nhớ)=============================== */}
                    <h3>Bộ nhớ</h3>
                    <div className="body__advanced-box row no-gutters" name="ram">
                        <div className="box__item col-6 pr-2">
                            <div className="form-group">
                                <select className="form-control" id="ram" onChange={handleRam}>
                                    <option value="0">RAM...</option>
                                    <option value="duoi-4-gb">Dưới 4 GB</option>
                                    <option value="tu-4-den-8-gb">Từ 4 đến 8 GB</option>
                                    <option value="tu-8-den-12-gb">Từ 8 đến 12 GB</option>
                                    <option value="tren-12-gb">Trên 12 GB</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    {/* ================================ FILTER DISPLAY (Hiển thị)=============================== */}
                    <h3>Hiển thị</h3>
                    <div className="body__advanced-box row no-gutters">
                        <div className="box__item col-6 pr-2">
                            <div className="form-group">
                                <select className="form-control" name="screenPanel" id="screenPanel" onChange={handleScreenPanel}>
                                    <option value="">Công nghệ màn hình...</option>
                                    {screenPanelName}
                                </select>
                            </div>
                        </div>
                        <div className="box__item col-6 pl-2">
                            <div className="form-group">
                                <select className="form-control" name="screenSize" id="screenSize" onChange={handleScreenSize}>
                                    <option value="0">Kích thước màn hình...</option>
                                    <option value="tu-6-den-6-5-inches">Từ 6 đến 6.5 inches</option>
                                    <option value="tu-6-5-den-7-inches">Từ 6.5 đến 7 inches</option>
                                    <option value="tren-7-inches">Trên 7 inches</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* ================================ FILTER BATTERY (Pin)=============================== */}
                    <h3>Pin</h3>
                    <div className="body__advanced-box row no-gutters">
                        <div className="box__item col-6 pr-2">
                            <div className="form-group">
                                <select className="form-control" name="battery" id="batteryCapacity" onChange={handleBatteryCapacity}>
                                    <option value="0">Dung lượng pin...</option>
                                    <option value="duoi-4000-mAh">Dưới 4000 mAh</option>
                                    <option value="tu-4000-den-5000-mAh">Từ 4000 đến 5000 mAh</option>
                                    <option value="tren-5000-mAh">Trên 5000 mAh</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="d-flex justify-content-center">
                        <button className="btn btn-primary w-100 text-white" role="button" type="button" onClick={handleSearch} >
                            Show all results
                        </button>
                    </div>

                    <div className="mt-3 text-danger">
                        <p>
                            *Giá được tính bằng giá niêm yết, không cộng dồn với thuế, trợ cấp, phí giao hàng. Chỉ những điện thoại đã
                            biết giá mới xuất hiện trong kết quả tìm kiếm.
                        </p>
                        <p>
                            *Thời gian chờ và đàm thoại của pin dựa trên thông số kỹ thuật chính thức của nhà sản xuất,
                            không dựa trên các bài kiểm tra thực tế.
                        </p>
                    </div>
                </div>
            </form>


            <Footer />
        </>
    );
}
