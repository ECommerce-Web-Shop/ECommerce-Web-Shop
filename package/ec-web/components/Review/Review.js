import React from "react";
import { RatingStars } from "../../components";

export default function Review({stars, comment, username, postedTime}) {
    const displayTimeAgo = () => {
        const ago = Date.now() - Number(new Date(postedTime));
        const year = 1000 * 60 * 60 * 24 * 365;
        const month = 1000 * 60 * 60 * 24 * 30;
        const day = 1000 * 60 * 60 * 24;
        const hour = 1000 * 60 * 60;
        const minute = 1000 * 60;
        const second = 1000;

        if(ago / year > 1)
            return `${Math.floor(ago / year)} năm trước`;

        if(ago / month > 1)
            return `${Math.floor(ago / month)} tháng trước`;

        if(ago / day > 1)
            return `${Math.floor(ago / day)} ngày trước`;

        if(ago / hour > 1)
            return `${Math.floor(ago / hour)} giờ trước`;

        if(ago / minute > 1)
            return `${Math.floor(ago / minute)} phút trước`;

        return `${Math.floor(ago / second)} giây trước`;
    };

    const displayPostedTime = () => {
        const date = new Date(postedTime);

        return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
    };

    const displayStars = () => {
        let result = [];
        let i = 1;

        for(i; i <= stars; i++)
            result.push(<i className="fas fa-star product__rating-icon fa-sm" />);
        
        for(i; i <= 5; i++)
            result.push(<i className="far fa-star product__rating-icon fa-sm" />);

        return result;
    }

    return (
        <div className="comment border p-3 my-2">
            <div className="d-flex justify-content-between align-items-center">
                <div className="username">{username}</div>
                <div className="posted-time">
                    <span className="font-italic mr-3">{ displayTimeAgo() }</span>
                    <span className="font-italic">{ displayPostedTime() }</span>
                </div>
            </div>
            <span className="rating-result">
                <RatingStars stars={stars} />
            </span>
            <p className="content">
                { comment }
            </p>
        </div>
    );
}
