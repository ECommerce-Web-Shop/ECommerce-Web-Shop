import React, { useEffect } from "react";

export default function ProductList(props) {
  useEffect(() => {
    if (props.isCarousel) {
      new Flickity(`#${props.id}`, {
        imagesLoaded: true,
        freeScroll: true,
        prevNextButtons: false,
        pageDots: false,
        contain: true,
      });
    }
  });

  let productList = props.productsList.map((product, index) => {
    return (
      <Product
        key={index}
        images={`${Config.API_URL}${product.thumbnail.url}`}
        sales={product.sales}
        regularPrice={product.regularPrice}
        rating={product.rating}
        votes={product.votes}
      >
        {product.name}
      </Product>
    );
  });

  return (
    <Flickity
      flickityRef={(c) => (flkty = c)}
      className={"carousel"} // default ''
      id={props.id}
      elementType={"div"} // default 'div'
      options={flickityOptions} // takes flickity options {}
      disableImagesLoaded={false} // default false
      reloadOnUpdate // default false
      static // default false
    >
      {productList}
    </Flickity>
  );
}
