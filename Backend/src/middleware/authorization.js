const jwt = require('jsonwebtoken')
const adminModel = require('../models/admins')
const auth = async(req,res,next) =>{
    //console.log('inside middleware')
    /*
    - get token from headers => Authoriztion => Bearer {token} => done
    - decode token and get id => done
    - search admin have token , id => done
    - authorized next or unauthorized stop
    */
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        //console.log(token)
        const decodedToken = jwt.verify( token , "welcomeToMySystem" )
        //console.log(decodedToken)
        // dataJson = JSON.parse(decodedToken.data)
        // console.log(dataJson)
        const admin = await adminModel.findOne({_id:decodedToken.data._id, 'tokens.token': token})
        //console.log(admin)
        if(!admin){
            return res.status(401).send({
                message:'please ',
            })
        }
        req.admin = admin
        req.token = token
        next()
    }
    catch(e){
        res.status(500).send({
            data:e,
            message:'please authintcate',
        })
    }
}
module.exports = auth