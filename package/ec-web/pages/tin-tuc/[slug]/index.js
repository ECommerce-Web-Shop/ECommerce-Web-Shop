import React from 'react'
import Head from 'next/head';

import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer'
import NewDetail from '../../../components/New/NewDetail';
import client from './../../../components/Category/apolloClient';
import {
    gql
} from "@apollo/client";

export async function getStaticPaths() {
    // Call an external API endpoint to get posts
    const {data} = await client.query(
        {
            query: gql`
              query  {
                blogs {
                  id
                  slug
                }
              }
            `,
        }
    )
    const blogs = await data.blogs
    
  
    // Get the paths we want to pre-render based on posts
    const paths = blogs.map((blog) => ({
      params: { slug: blog.slug },
    }))
  
    // We'll pre-render only these paths at build time.
    // { fallback: false } means other routes should 404.
    return { paths, fallback: false }
  }

  export async function getStaticProps({ params }) {
    const {data} = await client.query(
        {
            query: gql`
              query($slug:String!){
                getBlogBySlug(slug:$slug) {
                  id
                  title
                  description
                  thumbnail{
                    url
                  }
                }
              }
            `,
            variables:{
                slug: params.slug
            }
        }
    )
    const blog = data.getBlogBySlug
    return { props: blog }
  }
const index = (props) => {
    return (
        <>
            <Head>
                <title>Tin Tức</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"/>
                <link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css" integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p" crossOrigin="anonymous"/>
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"/>
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossOrigin="anonymous"/>
                <link rel="stylesheet" href="../../vendors/flickity.min.css"></link>
                <link rel="stylesheet" href="../../css/style.css"/>
                <link rel="stylesheet" href="../../css/news.css"/>
                <link rel="stylesheet" href="../../css/grid.css"/>
            </Head>
            <Header/>
            <NewDetail title={props.title} description={props.description} url={props.thumbnail.url}/>
            <Footer/>         
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
            <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
        
            <script src="../../vendors/flickity.pkgd.min.js"></script>
            <script src="../../js/main.js"></script>
            <script src="../../js/news.js"></script>
            
            <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossOrigin="anonymous"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossOrigin="anonymous"></script>
            <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossOrigin="anonymous"></script>
        </>
    )
}

export default index