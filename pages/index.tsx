import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Header from "../components/Header"
import {sanityClient,urlFor} from "../sanity"
import {Post} from "../typings"



export const getServerSideProps = async()=>{
  const query = `*[_type == "post"]{
    _id,
    title,
    
    author ->{
    image,
    name,
  },
  
   description,
   mainImage,
   slug,
    
  }`;
  const posts = await sanityClient.fetch(query) ;
  //console.log(posts)
  return {
    props :{
      posts,
    } ,
  }
}
export interface Props {
  posts : [Post];
}

function Home ({posts}:Props) {
  return (
    <div className=" max-w-7xl mx-auto">
      <Head>
        <title>Medium Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
    <div className="flex justify-between items-center bg-yellow-400 border-y border-black py-10 lg:py-0">
      <div className="px-10 pace-y-5">
        <h1 className="text-6xl max-w-xl font-serif "><span className="underline decoration-black decoration-4">Medium</span> is a place to write, read, and connect</h1>
        <h2>Its easy and free to post your thinking an any topic and connect with millions of readers.</h2>
      </div>

      <img 
      className="hidden md:inline-flex h-32 lg:h-96"
      src="https://www.pngplay.com/wp-content/uploads/9/McDonalds-Logo-PNG-Photos.png" />
    </div>






    {/* Posts */}
    <div className=" grid grid-cols-1 sm:grid-cols-2 lg:frid-cols-3 gap-3 md:gap-6 p-2 md:p-6   ">
      {posts.map((post) => (
        <div key={post._id} className="">
        <Link  key={post._id} href={`/post/${post.slug.current}`}>
          <div className="border rounded-xl group cursor-pointer overflow-hidden">
            {post.mainImage && (
                <img className="h-60 w-full object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out  "
                 src={urlFor(post.mainImage).url()!} alt=""/>
             )}

            <div className="flex justify-between p-5 bg-white ">
              <div className="">
              <p className="text-lg font-bold">{post.title}</p>
              <p className="text:sm">{post.description} by {post.author.name}</p>
              </div>
              <img className="h-12 w-12 rounded-full" 
              src={urlFor(post.author.image).url()!} alt=""/>
            </div>
          </div>
        </Link>
        </div>
      ))}
    </div>

    </div>
  )
}

export default Home
