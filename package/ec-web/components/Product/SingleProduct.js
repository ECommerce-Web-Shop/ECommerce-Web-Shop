import React from "react";
import { AiFillStar } from "react-icons/all";
import { useStateValue } from "../../Contexts/StateProvider";
import { toast } from "react-toastify";
import "./SingleProduct.scss";

function SingleProduct({ id, title, price, image, rating }) {
	const [state, dispatch] = useStateValue();

	const handleAddProduct = () => {
		toast.success("Thêm vào giỏ hàng thành công");
		dispatch({
			type: "ADD_TO_CART",
			item: {
				id: id,
				title: title,
				image: image,
				rating: rating,
				price: price,
			},
		});
	};

	return (
		<div key={id} className="product__item">
			<div className="item__image">
				<img src={image} alt="product-img" />
			</div>
			<div className="item__info">
				<div className="item__info-title">{title}</div>
				<div className="item__info-price">
					<small>$ </small>
					<p> {price} </p>
				</div>
			</div>
			<div className="item__rating">
				{Array(rating)
					.fill()
					.map((_, index) => (
						<AiFillStar key={index} />
					))}
			</div>
			<button className="btn-add" onClick={handleAddProduct}>
				Add Cart
			</button>
		</div>
	);
}

export default SingleProduct;
