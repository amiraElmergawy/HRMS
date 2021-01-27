const { ObjectID } = require('mongodb')
const mongoose = require('mongoose')
const customValidator = require('./customValidator')
const employeeModel = require('./employees')
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
    childs: []
})

departmentSchema.virtual('employees',{
    ref:'employee',
    localField:'_id',
    foreignField:'jobData.dept'
})

departmentSchema.pre('remove', async function(next){
    console.log('hhhhhhh')
    // const dept= this
    // await employeeModel.updateMany(
    //     {'jobData.dept': dept._id},
    //     { $set: { 'jobData.dept' : new ObjectID(1)}}
    // )
    // throw new Error('inside preeeeeeeee')
//    console.log(dept)
    // await dept.populate('employees').execPopulate()
    // console.log(dept.employees)
    // if (dept.employees) {
    //     throw new customValidator.ValidationError('لا يسمح بمسح هذا القسم لوجود عاملين به')
    // }
    // // else next()
})


const departmentModel = mongoose.model('department', departmentSchema)

module.exports = departmentModel