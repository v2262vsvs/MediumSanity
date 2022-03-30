export interface Post {
    key:string,
    _id:string,
    _rev:string,
    title:string,
    author: {
        name : string,
        image : string ,
    };
    description:string ,
    comments:Comment[],

    mainImage:{
    asset:{
    url:string
    };
    };

   slug : {
    current:string,
   };
   body: [object];
}
export interface Comment {
    approved:boolean,
    comment:string,
    email:string,
    name:string,
    post :{
        _ref:string,
        _type:string,
    }
    _createdAt:string,
    _id:string,
    _type:string,
    _updatedAt:string,
}