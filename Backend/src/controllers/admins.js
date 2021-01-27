const adminsModel = require('../models/admins')


const adminIndex = async (req, res) => {
    try {
        const admins = await adminsModel.find()
        if (!admins) return res.status(404).send('هذه البيانات غير موجوده')
        else return res.status(200).send(admins)
    }
    catch (e) {
        res.status(500).send({
            data: e
        })
    }
}

const adminDetails = async (req, res) => {
    const _id = req.params.id
    try {
        const admin = await adminsModel.findById({ _id })
        if (!admin) return res.status(404).send('هذه البيانات غير موجودة')
        else return res.status(200).send(admin)
    }
    catch (e) {
        res.status(500).send({
            // status:0,
            data: e
        })
    }
}

const adminCreate = async (req, res) => {
    adminData = new adminsModel(req.body)
    const token = await adminData.generateToken()
    try {
        await adminData.save()
        res.status(200).send({
            message: 'تمت العملية بنجاح',
            data: {adminData,token}
        })
    }
    catch (e) {
        // res.status(422).send('يرجي ادخال بيانات صحيحة')
        res.status(500).send({
            message:"يرجي ادخال بيانات صحيحة",
            data: e // to display only error message should access e.errors.name.message
        })
    }
}

const adminUpdate = async(req, res) => {
    const _id = req.params.id
    avlUpdates = ['userName', 'password']
    const keys = Object.keys(req.body)
    const flag = keys.every((k)=> avlUpdates.includes(k))
    if(!flag) return res.status(405).send({
        message:"غير مسموح بهذا التحديث",
        data:""
    })
    try {
        const admin = await adminsModel.findByIdAndUpdate(
            _id,
            req.body,
            { runValidators: true }
        )
        if (!admin) return res.status(404).send({
            message: 'هذه البيانات غير موجوده',
            data: ''
        })
        return res.status(200).send({
            message: "تمت العملية بنجاح",
            data: admin
        })
    }
    catch (e) {
        res.status(500).send({
            data: e
        })
    }
}

const adminDelete = async(req, res) => {
    const _id = req.params.id
    try {
        const admin = await adminsModel.findByIdAndDelete(
            _id
        )
        if (!admin) return res.status(404).send({
            message: 'هذه البيانات غير موجوده',
            data: ''
        })
        return res.status(200).send({
            message: "تمت العملية بنجاح"
        })
    }
    catch (e) {
        res.status(500).send({
            message: e,
        })
    }
}

const adminLogIn = async(req, res)=>{
    try{
        const admin = await adminsModel.findLogin(req.body.userName, req.body.password)
        const token = await admin.generateToken()
        res.status(200).send({
            data: {admin, token}
        })
    }
    catch(e){
        res.status(422).send({
            message:'يرجي ادخال بيانات صحيحة',
            data:e
        })
        // res.status(500).send({ // will cause an error for handling promise-response twice
        //     message:'يرجي ادخال بيانات صحيحة',
        //     data:e
        // })
    }
}

const adminLogOut = async(req, res)=>{
    //console.log(req.admin.tokens)
    try{
        req.admin.tokens = req.admin.tokens.filter((tokenObj)=>{
            return tokenObj.token !== req.token
        })
        //console.log(req.admin.tokens)
        await req.admin.save()
        res.status(200).send({
            message:"تم تسجيل الخروج بنجاح"
        })
    }
    catch(e){
        res.status(500).send({
            message:"حدث خطأ في تسجيل الخروج",
            data:e
        })
    }
}

module.exports = {
    adminIndex,
    adminDetails,
    adminCreate,
    adminUpdate,
    adminDelete,
    adminLogIn,
    adminLogOut
}