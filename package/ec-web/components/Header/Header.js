import Link from "next/link";
import DropdownUser from "./DropdownUser";
import React, { useEffect, useState } from "react";
import { userApi } from "../../apis";

export default function Header() {
    const [itemsNumber, setItemsNumber] = useState();

    useEffect(async () => {
        const cartId = localStorage.getItem("cartId");

        const { data } = await userApi.getUserCart(cartId);

        if (data && data.cart) {
            localStorage.setItem('cartId', data.cart._id);
            localStorage.setItem('cartLength', data.cart.items.length);
            localStorage.setItem('selectedItemLength', data.cart.items.filter(item => item.selected).length);
            setItemsNumber(data.cart.items.length);
        } else {
            localStorage.removeItem("cartId");
            localStorage.setItem("cartLength", 0);
        }
    });

    useEffect(() => {
        toggleMenuAndSearch();
    }, []);

    const toggleMenuAndSearch = () => {
        let menu = document.getElementById("menu--nav");
        let menuParent = document.getElementById("navbar-menu");
        let searchBar = document.getElementById("search-bar");
        let searchBtn = document.getElementById("search-btn");
        let searchIcon = document.getElementById("search-icon");
        let searchGo = document.getElementById("search-go")
        let searchAdvanced = document.getElementById("search-advanced")

        let overBodyLayer = document.getElementById("overlaybody");

        let body = document.querySelector("body");
        let root = document.getElementById("__next");

        // If window < 991, display mobile menu version
        if (innerWidth < 991)
            body.appendChild(menu);

        // If user change window width, change to suitable version
        window.onresize = function () {
            if (window.innerWidth >= 992) {
                root.style.transform = "translateX(0%)";
                if (getStyleElement(searchBar, "display") === "none") {
                    overBodyLayer.style.display = "none";
                    menuParent.appendChild(menu);
                    menu.style.transform = "none";
                    body.classList.remove("noscroll");
                }
            } else {
                body.appendChild(menu);
                menu.style.transform = "translateX(-60vw)";
            }
        }

        window.onscroll = function () {
            const backToTopBtn = document.getElementById("backToTopID");
            if (window.scrollY >= 150) {
                if(backToTopBtn)
                    backToTopBtn.style.display = "block";
            } else {
                if(backToTopBtn)
                    backToTopBtn.style.display = "none";
            }
        };

        // If bars button is clicked, open menu on left
        document.getElementById("bars-btn").onclick = function () {
            overBodyLayer.style.display = "block";
            menu.style.transform = "translateX(60vw)";
            root.style.transform = "translateX(60vw)";
            body.classList.add("noscroll");
        }

        // If search button is clicked, display search bar
        searchBtn.onclick = function () {
            searchBar.style.display = "flex";
            overBodyLayer.style.display = "block";
            body.classList.add("noscroll");
            searchIcon.style.display = "block";
            searchGo.style.display = "none"
            searchAdvanced.style.display = "none";
        }

        searchAdvanced.onclick = function () {
            body.classList.remove("noscroll");
        }

        searchGo.onclick = function () {
            body.classList.remove("noscroll");
        }

        searchBar.onclick = function () {
            searchGo.style.display = "block"
            searchAdvanced.style.display = "block";
            searchIcon.style.display = "none";
        }

        // If over body layer is click, close menu or search bar
        overBodyLayer.onclick = function () {
            if (getStyleElement(searchBar, "display") === "none") {
                root.style.transform = "translateX(0%)";
                menu.style.transform = "translateX(-60vw)";
                overBodyLayer.style.display = "none";
            } else {
                searchBar.style.display = "none";
                overBodyLayer.style.display = "none";
            }
            body.classList.remove("noscroll");
        }
    }

    return (
        <>
            <div className="top-nav bg-light text-dark my-0 py-1">
                <div className="container d-flex justify-content-between align-items-center my-0">
                    {/* <button type="button" className=" btn btn--no-outline px-0 my-0">
                    </button> */}
                    <div>
                    <i className="fas fa-phone-alt mr-2" aria-hidden="true"></i> Hotline: 0396042357</div>
                    <DropdownUser></DropdownUser>
                </div>
            </div>
            <div className="header__navbar sticky-top my-0">
                <div className="navbar--custom container">
                    <div className="navbar__logo">
                        <button type="button" className="text-white ml-3 mr-4 bars-btn btn btn--no-outline" id="bars-btn">
                            <i className="fa fa-bars fa--md" aria-hidden="true" />
                        </button>
                        <Link href="/" >
                            <a><img src="/img/logo.png" className="logo px-0" alt="" /></a>
                        </Link>
                    </div>
                    <div className="navbar__menu" id="navbar-menu">
                        <ul className="menu menu--nav" id="menu--nav">
                            <li className="menu__item">
                                <Link href="/san-pham">
                                    <a className="text-white">Sản phẩm</a>
                                </Link>
                            </li>
                            <li className="menu__item">
                                <Link href="/gioi-thieu">
                                    <a className="text-white">Về chúng tôi</a>
                                </Link>
                            </li>
                            <li className="menu__item">
                                <Link href="/tin-tuc">
                                    <a className="text-white">Tin tức</a>
                                </Link>
                            </li>
                            <li className="menu__item">
                                <Link href="/dich-vu">
                                    <a className="text-white">Dịch vụ</a>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="navbar__others">
                        <ul className="menu menu--horizontal">
                            <li className="menu__item">
                                <button id="search-btn" type="button" className="text-white btn btn--no-outline" id="search-btn">
                                    <i className="fas fa-search fa-lg" aria-hidden="true" />
                                </button>
                            </li>
                            <li className="menu__item">
                                <button type="button" className="btn btn--no-outline">
                                    <Link href="/gio-hang">
                                        <a><i className="fas fa-shopping-bag fa-lg text-white mr-2" data-amount={itemsNumber || 0} aria-hidden="true" /></a>
                                    </Link>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
                <form action className="search-bar" id="search-bar" action="/ket-qua-tim-kiem" method="GET">
                    <div className="container position-relative">
                        <input
                            type="text"
                            name="name"
                            id="search"
                            className="search-input container "
                            placeholder="Nhập tên sản phẩm"
                            style={{ width: "100%" }}
                        />
                        <button type="submit" className="btn btn--searchGo" id="search-go"
                        >
                            <div className="searchGo_text">
                            <i className="fas fa-search"></i>
                            </div>
                        </button>
                        <button type="submit" className="btn btn--search" id="search-advanced">
                            <Link href="/tim-kiem-chi-tiet">
                                <div className="searchGo_text">
                                    Chi tiết
                                </div>
                            </Link>
                        </button>
                        <button type="submit" className="btn btn--search" id="search-icon">
                            <i className="fa fa-search " aria-hidden="true" />
                        </button>
                    </div>
                </form>
                <div id="overlaybody"></div>
            </div>
            <a href="#" className="goTopBtn border" id="backToTopID">
                <i className="fas fa-angle-up fa-lg"></i>
            </a>
        </>
    )
}

function getStyleByID(idElement, styleProp) {
    var element = document.getElementById(idElement);
    if (element.currentStyle)
        var y = element.currentStyle[styleProp];
    else if (window.getComputedStyle)
        var y = document.defaultView.getComputedStyle(element, null).getPropertyValue(styleProp);
    return y;
}

function getStyleElement(element, styleProp) {
    if (element.currentStyle)
        var y = element.currentStyle[styleProp];
    else if (window.getComputedStyle)
        var y = document.defaultView.getComputedStyle(element, null).getPropertyValue(styleProp);
    return y;
}