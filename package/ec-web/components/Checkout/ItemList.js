import {gql} from '@apollo/client'
import Header from '../Header/Header'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

const itemList = () => {

  const [items, setItems] = useState([]);
  const [total, setTotals] = useState([]);


  useEffect(async () => {
    const cartId = localStorage.getItem('cartId');
    try
    { 
        const query = `
            query($cartId: ID!) {
                cart: getCart(cartId: $cartId) {
                  _id
                  items{
                    color
                    product{
                      thumbnail{
                        url
                      }
                      name
                      finalPrice
                    }
                    qty
                    selected
                    amount
                  }
                  finalAmount
                }
            }
        `;

        const variables = {
            cartId: localStorage.getItem("cartId")
        };

        const { data } = await axios({
            method: 'POST',
            url: '/api/query',
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                query,
                variables
            },
        });
        setItems(data.cart.items.filter(item => item.selected === true)); 
        setTotals(data.cart.finalAmount)
        sessionStorage.setItem('finalAmount', data.cart.finalAmount)
      }
      catch{
        
      }
}, []);

  return (
    <div> 
      {items.map((item) =>(
      <div class="form-group w-100">
          <div class="card text-white bg-white text-dark my-3 p-3"> 
            <div class="row no-gutters"> 
              <div class="col-4 item-thumbnail"> 
                  <img class="img-fluid"
                  src={process.env.NEXT_PUBLIC_API_URL + item.product.thumbnail.url}
                  alt=""></img>
              </div>
              <div class="col-8"> 
                  <div class="card-body py-0 pr-0"> 
                      <span class="card-text font-weight-bold">{item.product.name}</span>
                      <div class="card-text my-2 payment__quantity">
                          Số lượng:
                          <input class="ml-2 quantity__input" disabled="true" value={item.qty} min="0"/>
                      </div>
                      Đơn giá:<span id="price1" class="card-text item-price"> {item.amount.toLocaleString("DE-de")} VND</span> 
                  </div>
              </div>
            </div>
          </div>
          
      </div>
  ))
}
        <div class="d-flex justify-content-around mt-5">
            <span>Tổng tiền:</span>
            <span class="total-price">{total.toLocaleString("DE-de")} VNĐ   </span>
        </div>

    </div>
  )
}

export default itemList;
