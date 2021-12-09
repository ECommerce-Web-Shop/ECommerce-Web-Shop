import React from 'react'
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    useQuery,
    gql
} from "@apollo/client";

const client = new ApolloClient({
    uri: `${process.env.NEXT_PUBLIC_API_URL}/graphql`,
    cache: new InMemoryCache()
});

export const getBlogs = gql`
    query{
        blogs{
        id
        title
        slug
        description
        thumbnail{
            url
        }
        category{
            name
            slug
        }
        createdAt
        }
    }
`;

const getThreeBlogs = gql`
    query{
        blogs(limit:3){
        id
        title
        slug
        thumbnail{
            url
        }
        createdAt
        }
    }
`;

const getFourBlogs = gql`
query{
    blogs(limit:4){
    id
    title
    slug
    thumbnail{
        url
    }
    createdAt
    }
}
`

// const Carousel = () => {
//     return (
//         <div className="container px-0 banner">
//                 <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
//                     <ol className="carousel-indicators">
//                         <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active"></li>
//                         <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
//                         <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
//                     </ol>
//                     <div class="carousel-inner">
//                   <div class="carousel-item active">
//                     <img class="d-block w-100" src="https://cdn.tgdd.vn/Files/2021/07/23/1370249/galaxya52a72_1280x720-800-resize.jpg" alt="First slide"/>
//                     <div class="carousel-caption carousel-caption__edit">
//                         <span class="category">Tin hot</span>
//                         <h3>
//                             <a href="">[Khám phá] 3 thủ thuật nhỏ giúp bạn bảo mật iPhone hiệu quả</a>
//                         </h3>
//                         <span class="date">18 Tháng Bảy, 2021</span>
//                     </div>
//                   </div>
//                   <div class="carousel-item">
//                     <img class="d-block w-100" src="/img/News/IMG_20210515_220924_947.webp" alt="Second slide"/>
//                     <div class="carousel-caption carousel-caption__edit">
//                         <span class="category">Tin hot</span>
//                         <h3>
//                             <a href="">[Khám phá] 3 thủ thuật nhỏ giúp bạn bảo mật iPhone hiệu quả</a>
//                         </h3>
//                         <span class="date">18 Tháng Bảy, 2021</span>
//                     </div>
//                   </div>
//                   <div class="carousel-item">
//                     <img class="d-block w-100" src="/img/News/mg-6690x300.webp" alt="Third slide"/>
//                     <div class="carousel-caption carousel-caption__edit">
//                         <span class="category">Tin hot</span>
//                         <h3>
//                             <a href="">[Khám phá] 3 thủ thuật nhỏ giúp bạn bảo mật iPhone hiệu quả</a>
//                         </h3>
//                         <span class="date">18 Tháng Bảy, 2021</span>
//                     </div>
//                   </div>
//                 </div>                   
//                     <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
//                     <span className="carousel-control-prev-icon" aria-hidden="true"></span>
//                     <span className="sr-only">Previous</span>
//                     </a>
//                     <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
//                     <span className="carousel-control-next-icon" aria-hidden="true"></span>
//                     <span className="sr-only">Next</span>
//                     </a>
//                 </div>
//         </div>
//     )
// }

const NewsHot = () => {
    const { loading, error, data } = useQuery(getThreeBlogs);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :</p>;
    return (
        <div className="banner-child">
            {
                data.blogs.map(blog =>(

                <div className="banner-item col-lg-4">
                    <img src={process.env.NEXT_PUBLIC_API_URL+blog.thumbnail.url}/>
                    <h3>
                        <a href={`/tin-tuc/`+blog.slug}>{blog.title}</a>
                    </h3>
                    <span className="category">Tin hot</span>
                    <span className="date" >18 Tháng Bảy, 2021</span>
                </div>
                ))
            }
        </div>
    )
}


const NewsList = () => {
    const { loading, error, data } = useQuery(getBlogs);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
    return (
        <div className="col-lg-8 list-news">
                {data.blogs.map(blog => (
                    <div className="list-news__item pt-46">
                        <div className="col-lg-4 list-news__item-img">
                            <img src={process.env.NEXT_PUBLIC_API_URL+blog.thumbnail.url} />
                        </div>
                        <div className="col-lg-8 list-news__item-detail">
                            <h3>
                                <a href={`/tin-tuc/`+blog.slug}>{blog.title}</a>
                            </h3>
                            <span className="category">Tin hot</span>
                            <span>18 Tháng Bảy, 2021</span>
                        </div>
                    </div>
                ))}
                <div className="wrap-next-prev">
                    <a href="" className="wrap-next-prev__prev">
                        <i className="fa fa-angle-left wrap-next-prev__icon-edit" aria-hidden="true"></i>
                    </a>
                    <a href="" className="wrap-next-prev__next">
                        <i className="fa fa-angle-right wrap-next-prev__icon-edit" aria-hidden="true"></i>
                    </a>
                </div>
        </div>
    )
}

const NewsHotList = () => {
    const { loading, error, data } = useQuery(getFourBlogs);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :</p>;
    return(
            <div className="col-lg-4 list-news-hot">
                    <h4 className="list-news-hot__title">
                        <span>Bài viết đáng chú ý</span>
                    </h4>
                    {data.blogs.map(blog =>(
                        <div className="list-news-hot__item">
                            <div className="col-lg-4 list-news-hot__item-img">
                                <img src={process.env.NEXT_PUBLIC_API_URL+blog.thumbnail.url}/>
                            </div>
                            <div className="col-lg-8 list-news-hot__item-detail">
                                <h5>
                                    <a href={`/tin-tuc/`+blog.slug}>{blog.title}</a>
                                </h5>
                                <span className="category">Tin hot</span>
                                <span>18 Tháng Bảy, 2021</span>
                            </div>
                        </div>
                    ))}                
            </div>
    )

}

const NewsBody = () => {
    return (
        <div className="newsBody container mt-4  px-0 mb-4 news" style={{"background-color": " #fff "}}>
            <NewsList/>
            <NewsHotList/>
        </div>
    )
}

const New = () => {
    return (
        <ApolloProvider client={client}>
            <nav className="breadcrumb breadcrumb--custom pb-1">
                    <div className="container">
                        <a className="breadcrumb-item" href="/">
                            Trang chủ
                        </a>
                        <span className="breadcrumb-item active">Tin tức</span>
                    </div>
                </nav>
            {/* <Carousel/> */}
            <div className="container px-0 mb-4" style={{"background-color": " #fff "}}>
                <NewsHot/>
                <NewsBody/>
            </div>        
        </ApolloProvider>
    )
}

export default New
