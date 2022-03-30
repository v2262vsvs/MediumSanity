import { GetStaticProps } from "next";
import Header from "../../components/Header"

import {sanityClient,urlFor} from "../../sanity"
import {Post} from "../../typings"
interface Props {
    post: Post;
}
import {useForm , SubmitHandler} from "react-hook-form"
import { Children, useState } from "react";

//Portable text
import PortableText from "react-portable-text"

interface IFormInput {
    _id : string ,
    name :string,
    email : string,
    comment : string ,
}

function Post({post}: Props) {
    const [submitted,setSubmitted] = useState(false);
    //console.log(post);
    
    const {register , handleSubmit ,formState:{errors}} = useForm<IFormInput>();



    const onSubmit : SubmitHandler<IFormInput> =  (data) => {
       console.log(data)
       fetch("/api/createComment",{
        method : "POST",
        body: JSON.stringify(data),
    }).then(()=>{
        console.log(data)
        setSubmitted(true)
    }).catch((err)=>{
        console.log(err);
        setSubmitted(false)
    })

    };

return (
    <main>
        <Header/>
        
        {/* MAin part */}
        <img
            className="w-full h-40 object-cover"
            src={urlFor(post.mainImage).url()!}
            alt=""
        />
        <article className="max-2-3xl mx-auto p-5">
            <h1 className="text-3xl mt-10 mb-3">{post.title}</h1>
            <h2 className="text-xl font-light text-gray-500 mb-2"> {post.description}</h2>

            <div className="flex items-center space-x-2">
                <img
                    className="h-10 w-10 rounded-full"
                    src={urlFor(post.author.image).url()!}
                    alt=""
                />
                <p className="font-extralight text-sm">
                    Blog post by {" "} <span className="text-green-600">{post.author.name} </span> – Published at //You have to make date of post
                </p>
            </div>
           

            <div className="mt-10 ">
                <PortableText 
                 dataset = {process.env.NEXT_PUBLIC_SANITY_DATASET !}
                 projectId = {process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
                 content={post.body}
                 className=""
                 serializers={
                     {
                        h1: (props:any) => (
                             <h1 className="text-2xl font-bold my-5" {...props}></h1>
                        ),
                        h2: (props:any) => (
                            <h1 className="text-xl font-bold my-5" {...props}></h1>
                        ),
                        li: ({children}:any) => (
                            <li className="ml-4 list-disc">{children}</li>
                        ),
                        link: ({children,href}:any) => (
                            <a href={href} className="text-blue-500 hover:underline">{children}</a>
                        ),
                     }
                 }
                />
            </div>
        </article>
        {/* Comments */}
        <div className=" flex flex-col p-10 my-10 max-w-3xl mx-auto shadow-yellow-600 space-y-2 shadow text-center">
        <h4 className="text-3xl font-bold ">Comments</h4>
        <div className="border-t pb-2"></div>
            {post.comments.map(comment =>(
                <div key={comment._id} className="flex">
                <div className="text-sm text-yellow-500 flex ">{comment.name} : </div>
                <div className="text-gray-700 flex ml-2 "> {comment.comment}</div>
                </div>
            ))}
        <div className="border-t"></div>
        </div>



        <hr className="max-w-lg my-5 mx-auto border border-yellow-500"/>
            <input
                { ...register("_id")} 
                type="hidden"
                value={post._id}
            />
            {submitted ? (
              <div className="flex flex-col py-10 my-10 bg-yellow-500 text-white max-w-2xl mx-auto  rounded-xl shadow-lg">
                  <h3 className="text-3xl font-bold text-center ">Submitted!</h3>
                  <p className="text-center">Once it has been approved, it will qppear below! </p>
              </div>
            ):(
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col p-5 my-10 max-w-2xl mx-auto mb-10 ">
            <h3 className="text-sm text-yellow-500 ">Enjoy this article?</h3>
            <h4 className="text-3xl font-bold">Leave a comment below!</h4>
            <hr className="py-3 mt-2"></hr>
            <label className="block mb-5 ">
                <span className="text-gray-700 ">Name</span>
               
                <input  { ...register("name",{required:true})}  className="shadow border py-2 px-3 form-input mt-1 block w-full ring-yellow-500 rounded outline-none focus:ring" placeholder="John Appleseed" type="text"/>
            </label>
            <label className="block mb-5 ">
                <span className="text-gray-700 ">Email</span>
                <input  { ...register("email",{required:true})}  className="shadow border py-2 px-3 form-input mt-1 block w-full ring-yellow-500 rounded outline-none focus:ring" placeholder="John Appleseed" type="text"/>
            </label>
            <label className="block mb-5 ">
                <span className="text-gray-700 ">Comment</span>
                <textarea  { ...register("comment",{required:true})}  className="shadow border py-2 px-3 form-textarea mt-1 block w-full ring-yellow-500 rounded outline-none focus:ring" placeholder="John Appleseed" rows={9}/>
            </label>
            {/*error if smth empty  */}

            <div className="flex felx-col p-5 ">
                {errors.name&& 
                <span className="text-sm text-red-600 "> - The Name field is required</span>
                
                }
                {errors.name&& 
                <span className="text-sm text-red-600 "> - The Name field is required</span>
                
                }
                {errors.name&& 
                <span className="text-sm text-red-600 "> - The Name field is required</span>
                
                }
            </div>
            <input type="submit" className="shadow bg-yellow-500 hover:bg-yellow-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 rounded cursor-pointer " />
        </form>
            )}
        
    </main>
)
}

export default Post;



export const getStaticPaths= async  () => {
    const query=  `*[_type == "post"]{
        _id,
       slug{
           current
       },
        
      }`

    const posts = await sanityClient.fetch(query);
      const paths = posts.map((post : Post)  =>({
        params :{
            slug: post.slug.current
        }
      }))
    return {
        paths,
        fallback : 'blocking',
    }
}


export const getStaticProps : GetStaticProps =async ({params}) =>{
    const query =`*[_type == "post" && slug.current == $slug][0]{
        _id,
        createdAt,
        title,
        
        author ->{
        image,
        name,
      },
      'comments': *[
        _type=="comment"  &&
        approved==true &&
        post._ref==^._id
      ],
      
       description,
       mainImage,
       slug,
       body,
        
      }`
      const post =await sanityClient.fetch(query ,{
          slug : params?.slug,
      })
      if(!post){
          return  {
              notFound:true
          }
      }
      return {
        props:{
            post,
            revalidate : 60,
        }
      }
}