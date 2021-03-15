const employeesModel = require('../models/employees')

const employeeIndex = async (req, res) => {
    try {
        const employees = await employeesModel.find()
        if (!employees) res.status(404).send('هذه البيانات غير موجوده')
        else res.status(200).send(employees)
    }
    catch (e) {
        res.status(500).send({
            data: e
        })
    }
}

const employeeDetails = async (req, res) => {
    const _id = req.params.id
    try {
        const employee = await employeesModel.findById({ _id })
        if (!employee) res.status(404).send('هذه البيانات غير موجودة')
        else res.status(200).send(employee)
    }
    catch (e) {
        res.status(500).send({
            // status:0,
            data: e
        })
    }
}

const employeeCreate = async (req, res) => {
    let employeeData = new employeesModel({
        ...req.body
        // author: req.user._id
    })
    try {
        await employeeData.save()
        res.status(200).send({
            message: 'تمت العملية بنجاح',
            data: employeeData
        })
    }
    catch (e) {
        // res.status(422).send('يرجي ادخال بيانات صحيحة')
        res.status(500).send({
            data: e // to display only error message should access e.errors.name.message
        })
    }
}

const employeeUpdate = async (req, res) => {
    const _id = req.params.id
    // avlUpdates = ['name', 'manager']
    // const keys = Object.keys(req.body)
    // const flag = keys.every((k)=> avlUpdates.includes(k))
    // if(!flag) return res.status(405).send({
    //     message:"غير مسموح بهذا التحديث",
    //     data:""
    // })
    try {
        const employee = await employeesModel.findByIdAndUpdate(
            _id,
            req.body,
            { runValidators: true }
        )
        if (!employee) return res.status(404).send({
            message: 'هذه البيانات غير موجوده',
            data: ''
        })
        res.status(200).send({
            message: "تمت العملية بنجاح",
            data: employee
        })
    }
    catch (e) {
        res.status(500).send({
            data: e
        })
    }
}

const employeeDelete = async (req, res) => {
    const _id = req.params.id
    try {
        const employee = await employeesModel.findByIdAndDelete(
            _id
        )
        if (!employee) return res.status(404).send({
            message: 'هذه البيانات غير موجوده',
            data: ''
        })
        res.status(200).send({
            message: "تمت العملية بنجاح"
        })
    }
    catch (e) {
        res.status(500).send({
            message: e,
        })
    }
}



const employeeSearch = async (req, res) => {
    // avalKeys = ['contractData.insuranceNo', 'nationalData.nID', 'personalData.name', 'code', 'jobData.job']
    const keys = Object.keys(req.body)
    const searchValue = req.body
    try {
        const emp = await employeesModel.find({ 'keys[0]': searchValue['keys[0]'] })
        if (emp && emp.length != 0) return res.status(200).send({
            message: "تمت العملية بنجاح ",
            data: emp
        })
        else return res.status(404).send({
            message: " يرجي ادخال بيانات صحيحه  ",
            data: ""
        })
    }
    catch (e) {
        res.status(500).send({
            message: "حدث خطأ في الخادم الداخلي",
            date: e
        })
    }
}


const employeeSearch2 = async (req, res) => {
    // avalKeys = ['contractData.insuranceNo', 'nationalData.nID', 'personalData.name', 'code', 'jobData.job']
    const keys = Object.keys(req.body)
    const searchValue = req.body
    try {
        const employees = await employeesModel.find()
        const searchResult = employees.filter((item) => {
            // console.log(item)
            const x = item['keys[0]'].search(searchValue['keys[0]'])
            // console.log(x)
            if (x != -1) return x
        })
        console.log(searchResult)
        return res.status(200).send({
            message: "تمت العملية بنجاح ",
            data: searchResult
        })
        // if (emp && emp.length != 0) return res.status(200).send({
        //     message: "تمت العملية بنجاح ",
        //     data: emp
        // })
        // else return res.status(404).send({
        //     message: " يرجي ادخال بيانات صحيحه  ",
        //     data: ""
        // })
    }
    catch (e) {
        res.status(500).send({
            message: "حدث خطأ في الخادم الداخلي",
            date: e
        })
    }
}


module.exports = {
    employeeIndex,
    employeeDetails,
    employeeCreate,
    employeeUpdate,
    employeeDelete,
    employeeSearch
}