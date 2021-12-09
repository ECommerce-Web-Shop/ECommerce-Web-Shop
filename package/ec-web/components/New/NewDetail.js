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

const getBlog = gql`
    query{
        blogs(limit:1){
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

const NewsHot = () =>{
    const { loading, error, data } = useQuery(getBlog);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :</p>;
    return data.blogs.map(blog=>(
        <div className="list-news-new__item">
                    <div className="col-lg-12 list-news-new__item-img">
                        <img src={process.env.NEXT_PUBLIC_API_URL + blog.thumbnail.url}/>
                    </div>
                    <div className="col-lg-12 list-news-new__item-detail">
                        <h5>
                            <a href={`/tin-tuc/`+blog.slug}>{blog.title}</a>
                        </h5>
                        <span>18 Tháng Bảy, 2021</span>
                    </div>
        </div>
    ))
}

const ListNews = () => {
    const { loading, error, data } = useQuery(getFourBlogs);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :</p>;
    return data.blogs.map(blog =>(
        <div className="list-news-hot__item">
                    <div className="col-lg-4 list-news-hot__item-img">
                        <img src={process.env.NEXT_PUBLIC_API_URL + blog.thumbnail.url}/>
                    </div>
                    <div className="col-lg-8 list-news-hot__item-detail">
                        <h5>
                            <a href={`/tin-tuc/`+blog.slug}>{blog.title}</a>
                        </h5>
                        <span className="category">Tin hot</span>
                        <span>18 Tháng Bảy, 2021</span>
                    </div>
        </div>
    ))
}

const NewDetail = (props) => {
    return (
        <ApolloProvider client={client}>
        <nav className="breadcrumb breadcrumb--custom pb-1">
                    <div className="container">
                        <a className="breadcrumb-item" href="/">
                            Trang chủ
                        </a>
                        <a className="breadcrumb-item" href="/tin-tuc">
                            Tin tức
                        </a>
                        <span className="breadcrumb-item active">{props.title}</span>
                    </div>
                </nav>
        <div className="container mt-4 pt-28 px-0 mb-4" style={{"background-color": "#fff"}}>
            <div className="list-category">
                <span className="category"><a href="">Tin hot</a></span>
                <span className="category"><a href="">Tin trong ngày</a></span>
                <span className="category"><a href="">Tin tức</a></span>
                <span className="category"><a href="">Tin công nghệ</a></span>
               
            </div>
            <h1 className="entry-title">{props.title}</h1>
            <span className="date-header-news-detail">18 Tháng Bảy, 2021</span>
        </div>
        <div className="container mt-4  px-0 mb-4 news">
            <div className="col-lg-8 news-detail">
                <div className="news-detail__image">
                    <img src={process.env.NEXT_PUBLIC_API_URL+props.url}/>
                </div>
                <div className="newsInfo" id="news-detail__description" dangerouslySetInnerHTML={{
                                        __html: props.description,
                }}>
                </div>
            </div>
            <div className="col-lg-4 list-news-hot">
                <h4 className="list-news-hot__title">
                    <span>Bài viết mới</span>
                </h4>
                <NewsHot/>
                <ListNews/>     
            </div>
        </div>
        </ApolloProvider>
    )
}

export default NewDetail
