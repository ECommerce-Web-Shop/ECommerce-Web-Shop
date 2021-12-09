import React, { useEffect, useRef } from "react";
import Flickity from "react-flickity-component";

export default function Header() {
    let flkty = useRef();

    const flickityOptions = {
        // initialIndex: 2,
        freeScroll: true,
        wrapAround: true,
        imagesLoaded: true,
        autoPlay: 5000
    }

    useEffect(() => {
        if (flkty.playPlayer)
            flkty.playPlayer();
    }, [])

    return (
        <>
            {/* <div> */}
            <div className="container-fluid banner px-0" >
                <div className="carousel row mx-0">
                    <div className="col-12 pr-0 pl-0">
                        <Flickity
                            flickityRef={c => flkty = c}
                            className={'carousel'} // default ''
                            elementType={'div'} // default 'div'
                            options={flickityOptions} // takes flickity options {}
                            disableImagesLoaded={false} // default false
                            reloadOnUpdate // default false
                            static // default false
                        >
                            <img className="gallery-cell" src="./img/banner/banner1.png" alt="" style={{ maxHeight: "600px" }} />
                            <img className="gallery-cell" src="./img/banner/banner2.png" alt="" style={{ maxHeight: "600px" }} />
                            <img className="gallery-cell" src="./img/banner/banner3.png" alt="" style={{ maxHeight: "600px" }} />
                            <img className="gallery-cell" src="./img/banner/banner4.png" alt="" style={{ maxHeight: "600px" }} />
                        </Flickity>
                    </div>
                </div>
            </div >
            <div className="container-fluid px-auto">
                <div className="container py-2">
                    <div className="subBanner row col-12 w-100 mx-auto">
                        <div className="subBanner--content col-4 py-3 d-flex justify-content-center">
                            <p className="my-auto"><i className="fas fa-truck"></i> FREESHIP ĐƠN HÀNG {'>'}5000K</p>
                        </div>
                        <div className="subBanner--content col-4 py-3 d-flex justify-content-center">
                            <p className="my-auto"><i className="fas fa-shield-alt"></i> BẢO HÀNH 3 NĂM</p>
                        </div>
                        <div className="subBanner--content col-4 py-3 d-flex justify-content-center">
                            <p className="my-auto"><i className="fas fa-archive"></i> ĐỔI TRẢ MIỄN PHÍ TRONG VÒNG 7 NGÀY</p>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}
