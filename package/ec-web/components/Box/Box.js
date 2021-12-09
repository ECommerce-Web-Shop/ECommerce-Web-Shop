import React from 'react';
import Link from 'next/link';
import ProductList from '../ProductList/ProductList';

export default function Box(props) {
    const displayHotIcon = () => {
        if (props.isHot)
          return (
            <i className="fa fa-fire" aria-hidden="true" />
          );
      }

      const displayLink = () => {
          if(props.link) 
            return (
                <div className="col text-right">
                    <Link><a className="text-blue">Xem tất cả</a></Link>
                </div>
            )
        
      }

      const displayTitle = () => {
          if(props.title)
            return (
            <div className="box-title px-3">
                <h2 className="title">
                    {displayHotIcon()} {props.title}
                </h2>
                {displayLink()}
            </div>
            )
      }

    return (
        <div className="box container px-0">
          {displayTitle()}
          <div className="box-body">
            {props.children}
          </div>
        </div>
      )
}
