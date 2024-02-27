const jwt=require('jsonwebtoken');
const secrete='$supertouper@123'

function createTokenForLoginUser(user){
const payload={
    _id:user._id,
    email:user.email,
    profileUrl:user.profileURL,
    role:user.role,
};

// console.log('auth token:',payload);
const token=jwt.sign(payload,secrete);
return token;
}

function TokenVerification(Token){
const payload=jwt.verify(Token,secrete);
// console.log('payload',payload);
return payload;
}

module.exports={createTokenForLoginUser,TokenVerification};