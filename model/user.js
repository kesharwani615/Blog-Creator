const { createHmac } = require('crypto');
const {Schema,model}=require('mongoose')
const {createTokenForLoginUser,TokenVerification}=require('../service/Authentication')

const UserSchema= new Schema({
    FullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    salt:{
        type:String,
    },
    password:{
        type:String,
        required:true,
    },
    profileURL:{
        type:String,
        default:'images/default.png'
    },
    role:{
        type:String,
        enum:['USER','ADMIN'],//enum we can assign other values expect user and admin
        default:'USER'
    }
},{timestamps:true})

UserSchema.pre("save",function(next){// for SignUp
  const user=this;
  if(!user.isModified("password")) return;
//randomBytes(16).toString()
  const salt='someRandomSalt';
  const hashedPassword=createHmac('sha256',salt)//here salt is like secrete key
            .update(user.password)
            .digest("hex")

  this.salt=salt;//putting the salt into user
  this.password=hashedPassword// putting hash password into user
  next();
});

//it is mongoose virtual function
UserSchema.static('matchPassword', async function(email,password){//for Login
    const user=await this.findOne({email});
    if(!user) throw new Error('invalid user and password!');

    const hashPassword=user.password;
    const salt=user.salt;
    const userProvidedPassword=createHmac('sha256',salt)
    .update(password)
    .digest("hex")

    if(hashPassword!==userProvidedPassword) throw new Error('invalid user and password!');
    return createTokenForLoginUser(user);
})

const User=model('user',UserSchema);

module.exports=User;