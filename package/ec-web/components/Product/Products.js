import React from "react";
import SingleProduct from "./SingleProduct";
import "./Products.scss";

function Products({ data, showLoading }) {
	return (
		<div id="product">
			<div className="container">
				<div className="product__container">
					<h1 className="product__title">Products</h1>
					{showLoading()}
					<div className="row">
						{data &&
							data.length > 0 &&
							data.map((item) => {
								const { id, title, price, rating, image } = item;
								let forMatRating = Math.ceil(rating.rate);
								return (
									<SingleProduct
										key={id}
										id={id}
										title={title}
										price={price}
										rating={forMatRating}
										image={image}
									/>
								);
							})}
					</div>
				</div>
			</div>
		</div>
	);
}

export default Products;
