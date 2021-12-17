import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import Head from "next/head";
import Link from "next/link";

function index() {
    return (
        <>
                <Head>
                    <title>Chưa có đơn hàng</title>
                </Head>
                <Header></Header>
                <div className="text-center text-successful my-5">
                    <div className="container d-inline-block border shadow p-3" style={{ backgroundColor: "#FFFFFF", borderRadius: "20px" }}>
                    <img
                        src="./img/empty-cart.png"
                        style={{ maxWidth: "400px" }}
                    />
                        <h3 className="text-success">Hiện chưa có sản phẩm nào trong giỏ hàng!</h3>
                        <p>Quý khách vui lòng quay trở lại trang chủ để lựa chọn những sản phẩm vừa ý nhé!</p>
                        <div className="row d-flex justify-content-center">
                            <Link href="/">
                                <button className="btn btn-primary text-white mx-2" role="button" type="button" style={{ width: "200px" }}>
                                    <i class="fas fa-home"></i> Trở về trang chủ
                                </button>
                            </Link>
                            <Link href="/san-pham">
                                <button className="btn btn-info text-white mx-2" role="button" type="button" style={{ width: "200px" }}>
                                    <i class="fas fa-shopping-basket"></i> Xem tất cả sản phẩm
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
                <Footer></Footer>
            </>
    );
}

export default index;