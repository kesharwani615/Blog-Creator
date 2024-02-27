const path=require('path');
const mongoose=require('mongoose')
const ejs=require('ejs')
const express=require('express');
const userRouter=require('./router/userRouter')
const blogRouter=require('./router/blogRouter');
const app=express();
const cookieParser=require('cookie-parser');
const { checkuserAuthencation } = require('./middleware/CheckAuth');
const PORT=8000;

mongoose.connect('mongodb://127.0.0.1:27017/blogify')
.then((e)=>console.log('MongoDB is connected!'))
.catch((err)=>console.log('something went worng!'))

app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(checkuserAuthencation('Token'))
// console.log("path:",path.resolve(`./public/uploads`));
app.use(express.static('public'));

app.set('view engine','ejs');
app.set('views',path.resolve('./view'));

app.use('/',userRouter);
app.use('/blog',blogRouter)

app.set('port',(8000));

app.listen(PORT,()=>console.log(`Server is running PORT:${PORT}`))
