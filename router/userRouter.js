const {Router}=require('express')
const router=Router();
const User=require('../model/user')
const Blog=require('../model/blog');

router.get('/',async(req,res)=>{
   const allBlog=await Blog.find({});
      return res.render('home',{user:req.user,blogs:allBlog});
})

router.get('/signin',(req,res)=>{
   return res.render('signin')
})

router.get('/signup',(req,res)=>{
   return res.render('signup')
})

router.get('/logout',(req,res)=>{
   return res.clearCookie('Token').redirect('/');
})

router.post('/signup',async(req,res)=>{
    const {FullName,email,password}=req.body;
    await User.create({
        FullName,
        email,
        password,
    })
    res.redirect('/');
})

router.post('/signin',async(req,res)=>{
   try{
   const {email,password}=req.body;
   const Token=await User.matchPassword(email,password);
   // console.log("Token:",Token)
   return res.cookie('Token',Token).redirect('/');
   }catch(err){
      return res.render('signin',{error:'invalid details!'});
   }
})

module.exports=router;