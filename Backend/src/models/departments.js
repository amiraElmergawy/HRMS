const { ObjectID } = require('mongodb')
const mongoose = require('mongoose')
const customValidator = require('./customValidator')
// const employeeModel = require('./employees')
const departmentSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate(value) {
            customValidator.testAr(value)
        }
    },
    head: {
        type: mongoose.Schema.Types.ObjectId,
        // required: true, // every department has a manager
        ref:'employee'
    },
    childs: [],
    parent:{}
})

// departmentSchema.pre('save', async function (next) {
//     console.log(this,'pre save')
//     // const adminData = this
//     // if (adminData.isModified('password')) adminData.password = await bcrypt.hash(adminData.password, 15)
//     next();
// })

departmentSchema.virtual('employees',{
    ref:'employee',
    localField:'_id',
    foreignField:'jobData.dept'
})



const departmentModel = mongoose.model('department', departmentSchema)

module.exports = departmentModel