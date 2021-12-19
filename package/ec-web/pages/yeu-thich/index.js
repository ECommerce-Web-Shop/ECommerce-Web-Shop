import React from "react";
import Head from "next/head";
import { graphqlClient, gql } from "../../helpers/apollo-client";
import withIronSession from "../../helpers/customWithIronSession";
import { Header, Footer, Pagination } from "../../components";
import { useState } from "react";
import Modal from "../../components/Modal/Modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

export const getServerSideProps = withIronSession(async ({ req, res, params }) => {
  const jwt = req.session.get("user") ? req.session.get("user").jwt : null;
  const user = req.session.get("user");
  const isSignedIn = user ? true : false;

  if (!isSignedIn) {
    res.writeHead(302, {
      Location: "/dang-nhap",
    });
    return res.end();
  }
  const client = graphqlClient(jwt);
// Get data wish líst 
  const { data } = await client.query({
    query: gql`
      query {
        wishLists: getWishLists {
          products {
            id
            slug
            name
            thumbnail {
              url
            }
            finalPrice
            options {
              quantityInStock
            }
          }
        }
      }
    `,
  });
  return {
    props: {
      wishLists: data.wishLists,
      products: data.wishLists.products,
      isSignedIn: jwt ? true : false,
      jwt,
    },
  };
});

const index = ({ products, jwt }) => {
  const deleteWishList = async (productId) => {
    const client = graphqlClient(jwt);
    // Get data ís deleted 
    const { data } = await client.mutate({
      mutation: gql`
        mutation removeItemsInWishList($productId: ID!) {
          removeItemsInWishList(productId: $productId) {
            products {
              id
              slug
              name
              thumbnail {
                url
              }
              finalPrice
              options {
                quantityInStock
              }
            }
          }
        }
      `,
      variables: {
        productId: productId,
      },
    });

    setProducts_2(data.removeItemsInWishList.products);
    return data ? true : false;
  };
  const DisplayProduct = (product) => {
    return product.map((product) => {
      const id = product.id;
      const slug = "/san-pham/" + product.slug;
      const image = product.thumbnail.url;
      const name = product.name;
      const price = product.finalPrice.toLocaleString("DE-de");
      let status = "";
      if (product.options[0].quantityInStock === 0) status = "Hết hàng";
      else status = "Còn hàng";

      const handleSubmitDeleteWishList = async () => {
        // e.preventDefault();
        const modal = document.getElementById("deleteConfirm");
        const yesBtn = modal.querySelector("#yesBtn");

        try {
          yesBtn.setAttribute("disabled", true);
          yesBtn.innerHTML = `
                  <span class="spinner-border spinner-border-sm"></span>
                  Đang xóa... 
              `;
          if (deleteWishList(id)) {
            toast.success(`Bạn đã xóa thành công ${name}`, {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }
          else {
            toast.error(`Đã xảy ra lỗi vui lòng thử lại sau`, {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }
            yesBtn.removeAttribute("disabled");
            yesBtn.innerHTML = "Đồng ý";
          
        } catch (error) {
          yesBtn.removeAttribute("disabled");
          yesBtn.innerHTML = `
                  Đồng ý 
              `;
        }
      };

      return (
        <div
          key={id}
          className="wishlistRow container rounded shadow row  mt-2 mb-3 ml-2 pt-2 pb-2 text-center"
        >
          <div className="col l-4 wishlistRow-thumbnail md-6 col-8 col-md-6 d-flex">
            <img
              src={process.env.NEXT_PUBLIC_API_URL + image}
              alt={name}
              className="wishlist-item_img"
            />
            <div>
              <span className="wishlist-item_text">{name}</span>
            </div>
          </div>
          <div className="wishlistRow-price col l-2 md-3 col-4 col-md-3 d-flex align-items-center justify-content-center">
            <span>{price} VND</span>
          </div>
          <div className="wishlistRow-status col l-2 md-3 col-3 d-flex align-items-center justify-content-center">
            <span>{status}</span>
          </div>
          <div className="wishlistRow-buttons col c-o-4 l-4 md-o-4 d-flex align-items-center justify-content-center">
            <ToastContainer
              position="top-center"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
            <Modal
              name={name}
              id="deleteConfirm"
              title="Bạn có chắc muốn xóa sản phẩm này ra khỏi sản phẩm yêu thích của bạn không?"
              body="Sản phẩm này sau khi xóa sẽ không thể khôi phục được. Bạn có chắc muốn thực hiện điều này?"
              confirmStyle="danger"
              cancelStyle="secondary"
              callback={handleSubmitDeleteWishList}
            />
            <Link href={slug}>
              <button
                type="button"
                className="btn btn-outline-info mr-2"
                id="addToCartBtn"
              >
                Mua ngay 
              </button>
            </Link>
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={() => {
                $(`#deleteConfirm`).modal();
              }}
            >
              Xóa
            </button>
          </div>
        </div>
      );
    });
  };
// Declare variable for pagination 
  const [product_2, setProducts_2] = useState(products);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(5);

  const indexOfLastProduct = productsPerPage * currentPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = product_2.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <Head>
        <title>Sản phẩm yêu thích</title>
        <link rel="stylesheet" href="./css/wishlist.css" />
        <link rel="stylesheet" href="./css/style.css" />
        <link rel="stylesheet" href="./css/grid.css" />
      </Head>
      <Header />
      <div>
        <nav className="breadcrumb breadcrumb--custom pb-1">
          <div className="container">
            <a className="breadcrumb-item" href="/">
              Trang chủ
            </a>
            <span className="breadcrumb-item active">Sản phẩm yêu thích</span>
          </div>
        </nav>
      </div>
      <div>
        <div className="container bg-white rounded pd-5 mt-4 pb-3">
          <div className=" container wishlist-row grid wide pr-3">
            <div className="wishlistRow-title shadow-sm p-3 mb-3 bg-white rounded row text-center">
              <div className="col l-4 md-6 c-6">
                <h5>Tên sản phẩm</h5>
              </div>
              <div className="col l-2 md-3 c-0">
                <h5>Giá</h5>
              </div>
              <div className="col l-2 md-3 c-0">
                <h5>Trạng thái</h5>
              </div>
              <div className="col l-4 md-0 c-0">
                <h5>Chỉnh Sửa</h5>
              </div>
            </div>
            {DisplayProduct(currentProducts)}
            <Pagination
              productsPerPage={productsPerPage}
              totalProducts={product_2.length}
              paginate={paginate}
              currentPage={currentPage}
            ></Pagination>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
export default index;
