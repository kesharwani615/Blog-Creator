const { TokenVerification }=require('../service/Authentication');

function checkuserAuthencation(TokenName){
    // console.log('tokenName:',TokenName);
    return((req,res,next)=>{
    const TokenNeedToVerification=req.cookies[TokenName];
    // console.log('TokenNeedToVerification:',TokenNeedToVerification)
    if(!TokenNeedToVerification){
        // res.render('home')
        return next();
    }
    try{
       const verifiedToken=TokenVerification(TokenNeedToVerification)
       req.user=verifiedToken;
    }catch(err){}
    return next();
    })
}

module.exports={checkuserAuthencation}