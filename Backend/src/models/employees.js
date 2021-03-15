const mongoose = require('mongoose')
const customValidator = require('./customValidator')
const employeeSchema = mongoose.Schema({
    code: {
        type: Number,
        required: true,
        unique:true
    },
    personalData: {
        name: { // will consist of 4 strings
            type: String,
            required: true,
            trim: true,
            minLength: 8,
            maxLength: 100,
            validate(value) {
                customValidator.testAr(value)
            }
        },
        gender: {
            type: Boolean, // 0 for male and 1 for female
            required: true
        },
        religion: {
            type: Boolean, // 0 for muslim and 1 for Christian
            required: true
        },
        Nationality: {
            type: String,
            required: true,
            trim: true,
            validate(value) {
                customValidator.testAr(value)
            }
        },
        mStatus: {
            type: String,
            required: true,
            trim: true,
            validate(value) {
                customValidator.testAr(value)
            }
        },
        phoneNo: {
            type: String,
            required: true,
            trim: true,
            pattern: "^[0-9]{11}$",
            validate(value){
                customValidator.customTest(value, this.pattern)
            }
        },
        address: {
            type: String,
            required: true,
            trim: true,
            pattern:"^[0-9 \u0621-\u064A]+$",
            validate(value) {
                customValidator.customTest(value, this.pattern)
            }
        },
        country: {
            type: String,
            required: true,
            trim: true,
            // pattern: "^[\u0621-\u064A]+$",// only accept Arabic letters
            validate(value) {
                customValidator.testAr(value)
            }
        },
        birthDate: {
            type: Date,
            required: true
        },
        age: { // will be calculated untill now
            type: Number,
            required: true,
            validate(value) {
                if (value < 18) throw new Error('invalid age')
            }
        },
        birthPlace: {
            type: String,
            trim: true,
            required: true,
            pattern: "^[\u0621-\u064A 0-9]+$",
            validate(value){
                customValidator.customTest(value, this.pattern)
            }
        },
        motherName: {
            type: String,
            trim: true,
            minLength: 2,
            maxLength: 100,
            required: true,
            validate(value) {
                customValidator.testAr(value)
            }
        }
    },
    nationalData: {
        nID: { // for national id
            type: String,
            required: true,
            pattern: "^[0-9]{14}",
            validate(value){
                customValidator.customTest(value, this.pattern)
            }
        },
        currentAddress: { // current address
            type: String,
            trim: true,
            required: true,
            pattern: "^[\u0621-\u064A 0-9]+$",
            validate(value){
                customValidator.customTest(value, this.pattern)
            }
        },
        country: {
            type: String,
            trim: true,
            required: true,
            validate(value) {
                customValidator.testAr(value)
            }
        },
        cRegistry: { // for The employee’s civil registry
            type: String,
            trim: true,
            required: true,
            validate(value) {
                customValidator.testAr(value)
            }
        },
        issDate: { // Date of issuance of the national ID card
            type: Date,
            required: true
        },
        expDate: { // The expiry date of the national ID card
            type: Date,
            required: true
        },
    },
    academicData: { // Academic qualification data
        acadQualification: {
            type: String,
            required: true,
            validate(value) {
                customValidator.testAr(value)
            }
        },
        specialization: {
            type: String,
            required: true,
            validate(value) {
                customValidator.testAr(value)
            }
        },
        degree: {
            type: String,
            required: true,
            pattern: "^[\u0621-\u064A 0-9]+$",
            validate(value){
                customValidator.customTest(value, this.pattern)
            }
        },
        university: {
            type: String,
            required: true,
            validate(value) {
                customValidator.testAr(value)
            }
        },
        collage: {
            type: String,
            required: true,
            validate(value) {
                customValidator.testAr(value)
            }
        },
        yearsNo: { // number of studying years
            type: String,
            required: true,
            pattern: "^[0-9]{1,2}$",
            validate(value){
                customValidator.customTest(value, this.pattern)
            }
        },
        gradYear: {
            type: String,
            required: true,
            pattern: "^[\u0621-\u064A 0-9]+$",
            validate(value){
                customValidator.customTest(value, this.pattern)
            }
        },
        anotherQualifications: {
            type: String,
        },
    },
    contractData: { // Employment contract data
        hireDate: {
            type: Date,
            required: true
        },
        workYearsNo: {
            type: Number,
            // required:trure,
        },
        contractType: {
            type: String,
            required: true,
            // pattern: "^[\u0621-\u064A 0-9]+$",
        },
        opType: { // part-time, full-time, etc....
            type: String,
            required: true,
            // pattern: "^[\u0621-\u064A]+$",
            validate(value) {
                customValidator.testAr(value)
            }
        },
        startaDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        insuranceNo: {
            type: String,
            required: true,
            pattern: "^[0-9]+$",
            validate(value){
                customValidator.customTest(value, this.pattern)
            }
        },
        insuranceDate: {
            type: Date,
            required: true,
        }
    },
    jobData: {
        job: {
            type: String,
            required: true,
            validate(value) {
                customValidator.testAr(value)
            }
        },
        dept: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref:'department'
        },
        directPoss: {
            type: mongoose.Schema.Types.ObjectId,
            // required: true, // manager case
            ref:'employee'
        },
        salary: { // first salary (in the contract) can't be updated
            type: Number,
            // required: true
        },
        currentSalary: {
            type: Number,
            required: true
        },
        status: { // can have extra salary or not
            type: Boolean,
            required: true,
        },
        endStatus: { // current status of employee's job
            type: String,
            required: true,
            validate(value) {
                customValidator.testAr(value)
            }
        }
    }
})


// employeeSchema.virtual('managers',{
//     ref:'department',
//     localField:'_id',
//     foreignField:'head'
// })

const employeeModel = mongoose.model('employee', employeeSchema)

module.exports = employeeModel
