import React from 'react';
import Image from "next/image";

export default function About() {
    return (
        <div className="container" style={{backgroundColor:"#fff",marginTop:"-30px"}}>
            <div className="tab">
                <ul className="tab__list">
                    <li className="active">
                        <a href="/cong-ty/gioi-thieu-chung">Giới thiệu chung</a>
                    </li>
                </ul>
            </div>

            <div className="showtab">
                <div className="box01">
                    <p>
                        <span><b>Công ty Cổ phần Đầu tư DeveraShop </b></span>DeveraShop là nhà bán lẻ số 1 Việt Nam về doanh thu và lợi nhuận,DeveraShop với mạng lưới hơn 4.500 cửa hàng trên toàn quốc. vận hành các chuỗi bán lẻ DeveraShop.com
                    </p>
                    <ul>
                        <li>
                            <span><b>DeveraShop</b></span> tập trung xây dựng dịch vụ khách hàng khác biệt với chất lượng vượt trội, phù hợp với văn hoá đặt khách hàng làm trung tâm trong mọi suy nghĩ và hành động của công ty.
                        </li>
                        <li>
                            <span><b>DeveraShop</b></span> vinh dự khi liên tiếp lọt vào bảng xếp hạng TOP 50 công ty niêm yết tốt nhất Châu Á của tạp chí uy tín Forbes và là đại diện Việt Nam duy nhất trong Top 100 nhà bán lẻ hàng đầu Châu Á – Thái Bình
                            Dương do Tạp chí bán lẻ châu Á (Retail Asia) và Tập đoàn nghiên cứu thị trường Euromonitor bình chọn.
                        </li>
                        <li>
                            <b><span>DeveraShop</span> </b>nhiều năm liền có tên trong các bảng xếp hạng danh giá như TOP 500 nhà bán lẻ hàng đầu Châu Á – Thái Bình Dương (Retail Asia) và dẫn đầu TOP 50 công ty kinh doanh hiệu quả nhất Việt Nam (Nhịp Cầu Đầu
                            Tư)… Sự phát triển của DeveraShop cũng là một điển hình tốt được nghiên cứu tại các trường Đại học hàng đầu như Harvard, UC Berkeley, trường kinh doanh Tuck (Mỹ).
                        </li>
                        <li>
                            Không chỉ là một doanh nghiệp hoạt động hiệu quả được nhìn nhận bởi nhà đầu tư và các tổ chức đánh giá chuyên nghiệp, <span><b>DeveraShop</b></span> còn được người lao động tin yêu khi lần thứ 4 liên tiếp được vinh danh trong TOP
                            50 Doanh nghiệp có môi trường làm việc tốt nhất Việt Nam và là doanh nghiệp xuất sắc nhất tại giải thưởng Vietnam HR Awards – “Chiến lược nhân sự hiệu quả”.
                        </li>
                    </ul>
                </div>

                <div className="box02">
                    <div className="block tgdd">
                        <div className="block__top">
                            <div className="main-img">
                                <Image className="lazy" src="https://mwg.vn/uploads/img/sites/4/pic_tgdd.png" data-original="https://mwg.vn/uploads/img/sites/4/pic_tgdd.png" layout="fill" />
                            </div>
                            <div className="main-text">
                                <div className="main-text-ct">
                                    <div>
                                        <span className="sitename">DeveraShop.com </span>
                                        <p>
                                            được thành lập từ năm 2021, là chuỗi bán lẻ <b>thiết bị di động</b> (điện thoại di động, máy tính bảng, laptop và phụ kiện) có <b>thị phần số 10 Việt Nam</b> với hơn 2.500 điểm bán thiết bị di động (bao gồm
                                            gần 1.000 cửa hàng Di Động ) hiện diện tại 63 tỉnh thành trên khắp Việt Nam.<br />
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <ul className="block__number">
                            <li>
                                <i className="icon-store"></i>
                                <div className="li-txt">
                                    <p className="txt01">2.173</p>
                                    <p className="txt02">
                                        CỬA HÀNG TRÊN<br />
                                        TOÀN QUỐC
                                    </p>
                                </div>
                            </li>
                            <li>
                                <i className="icon-people"></i>
                                <div className="li-txt">
                                    <p className="txt01">520.000</p>
                                    <p className="txt02">
                                        KHÁCH ĐƯỢC<br />
                                        PHỤC VỤ MỖI NGÀY
                                    </p>
                                </div>
                            </li>
                            <li>
                                <i className="icon-time"></i>
                                <div className="li-txt">
                                    <p className="txt01">08:00 - 22:00</p>
                                    <p className="txt02">
                                        KỂ CẢ CHỦ NHẬT &<br />
                                        NGÀY LỄ
                                    </p>
                                </div>
                            </li>
                        </ul>
                        <div className="block__website">
                            <a href="https://www.thegioididong.com" className="block__website__item" target="_blank">
                                <i className="icon-website"></i>
                                Website: <span>www.DeveraShop.com</span>
                            </a>
                        </div>
                    </div>                           
                </div>
            </div>
        </div>
    )
}