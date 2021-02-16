const mongoose = require('mongoose')
// const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const customError = require('./customValidator').ValidationError // to define error with custom message
const adminSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    type: { // 0 for ordinary users (will access only create, search, and get methods) and 1 for admin
        type: Boolean,
        required: true,
        default: 0,
    },
    tokens: [{
        token: {
            type: String
        }
    }]
})


adminSchema.methods.toJSON = function(){
    const admin = this.toObject()
    delete admin.password
    delete admin.tokens
    delete admin.__v
    return admin
}

adminSchema.pre('save', async function (next) {
    const adminData = this
    if (adminData.isModified('password')) adminData.password = await bcrypt.hash(adminData.password, 15)
    next()
})

adminSchema.statics.findLogin = async (userName, password) => {
    const admin = await adminModel.findOne({ userName })
    if (!admin) throw new customError('اسم المستخدم غير صحيح')
    flag = await bcrypt.compare(password, admin.password)
    if (!flag) throw new customError('كلمة المرور غير صحيحة')
    return admin
}
adminSchema.methods.generateToken = async function () {
    const admin = this
    // console.log(admin)
    const token = jwt.sign({_id:admin._id.toString()}, 'welcomeToMySystem')
    // console.log(admin.tokens)
    admin.tokens = admin.tokens.concat({ token })
    await admin.save()
    return token
}

const adminModel = mongoose.model('admin', adminSchema)
module.exports = adminModel