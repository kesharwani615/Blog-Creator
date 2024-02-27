const {Router}=require('express');
const router=Router();
const path=require('path');
const Blog=require('../model/blog');
const multer=require('multer');
const CommentSchema = require('../model/comment');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,path.resolve(`./public/uploads/`)) 
    },
    filename: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}`
      cb(null,fileName);
    }
  })
  
  const upload = multer({ storage: storage })

router.get('/get-blog',(req,res)=>{
    return res.render('addBlog',{user:req.user});
})

router.get('/viewBlog/:id',async (req,res)=>{
  console.log("req.params.id",req.params.id);
  const viewBlog=await Blog.findOne({_id:req.params.id}).populate('createdBy');
  const comment=await CommentSchema.find({blogId:req.params.id}).populate('createdBy')
  console.log('viewBlog:',viewBlog);
  console.log('comment:',comment)
  return res.render('blog',{
    user:req.user,
    viewBlog,
    comment,
  });
})

//comment route
router.post(`/comment/:Blogid`,async(req,res)=>{
  const body=req.body;
  // console.log("body:",req.user);
  const Blogid=req.params.Blogid;
  const comment=await CommentSchema.create({
    content:body.content,
    blogId:Blogid,
    createdBy:req.user._id,
  })
  return res.redirect(`/blog/viewBlog/${req.params.Blogid}`);
})


router.post('/create-blog',upload.single('Cover_Profile'),async(req,res)=>{
const body=req.body;
const blog=await Blog.create({
    title:body.Title,
    body:body.body,
    coverImgURL:`/uploads/${req.file.filename}`,
    createdBy:req.user._id,
})
console.log(blog);
return res.redirect(`/`);
})

module.exports=router;