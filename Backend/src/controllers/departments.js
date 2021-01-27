const departmentsModel = require('../models/departments')

const departmentIndex = async (req, res) => {
    try {
        const departments = await departmentsModel.find()
        if (!departments) res.status(404).send('هذه البيانات غير موجوده')
        else res.status(200).send(departments)
    }
    catch (e) {
        res.status(500).send({
            data: e
        })
    }
}

const departmentDetails = async (req, res) => {
    const _id = req.params.id
    try {
        const department = await departmentsModel.findById({ _id })
        if (!department) res.status(404).send('هذه البيانات غير موجودة')
        else res.status(200).send(department)
    }
    catch (e) {
        res.status(500).send({
            // status:0,
            data: e
        })
    }
}

const departmentCreate = async (req, res) => {
    departmentData = new departmentsModel({
        ...req.body
    })
    try {
        await departmentData.save()
        res.status(200).send({
            message: 'تمت العملية بنجاح',
            data: departmentData
        })
    }
    catch (e) {
        // res.status(422).send('يرجي ادخال بيانات صحيحة')
        res.status(500).send({
            data: e // to display only error message should access e.errors.name.message
        })
    }
}

const departmentUpdate = async (req, res) => {
    const _id = req.params.id
    avlUpdates = ['name', 'head']
    const keys = Object.keys(req.body)
    const flag = keys.every((k) => avlUpdates.includes(k))
    if (!flag) return res.status(405).send({
        message: "غير مسموح بهذا التحديث",
        data: ""
    })
    try {
        const department = await departmentsModel.findByIdAndUpdate(
            _id,
            req.body,
            { runValidators: true }
        )
        if (!department) return res.status(404).send({
            message: 'هذه البيانات غير موجوده',
            data: ''
        })
        res.status(200).send({
            message: "تمت العملية بنجاح",
            data: department
        })
    }
    catch (e) {
        res.status(500).send({
            data: e
        })
    }
}

const departmentDelete = async (req, res) => {
    const _id = req.params.id
    try {
        console.log(_id)
        console.log('1')
        // const department = await departmentsModel.findByIdAndDelete(_id)
        const department = await departmentsModel.find({_id})
        await department.remove()
        if (!department) return res.status(404).send({
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

const departmentEmployees = async (req, res) => {
    const _id = req.params.id
    const dept = await departmentsModel.findById(_id) // return department of this id
    try {
        await dept.populate('employees').execPopulate()
        res.status(200).send({
            message:"تمت العملية بنجاح",
            data:dept.employees
        })
    }
    catch (e) {
        res.status(500).send({
            message: "يوجد خطأ في الخادم الداخلي",
            data: e
        })
    }

}


const departmentAddChild = async (req, res) => {
    const _id = req.params.id
    childData = new departmentsModel(req.body)
    try {
        const dept = await departmentsModel.findById(_id)
        if(!dept) return res.status(404).send({
            message: 'القسم غير موجود'
        })
        else{
            const flag = dept.childs.find( child => child.name === childData.name )
            if (!flag) {
                dept.childs.push(childData);
                await dept.save()
                return res.status(200).send({
                    message: 'تمت العملية بنجاح',
                    data: dept
                })
            }
            else return res.status(405).send({
                message: ' يرجي ادخال بيانات صحيحه ',
                data: ""
            })
        }
    }
    catch (e) {
        res.status(500).send({
            message:"حدث خطأ في الخادم الداخلي",
            data: e // to display only error message should access e.errors.name.message
        })
    }
}

const departmentSearch1 = async(req, res)=>{
    const name = req.body.name
    try{
        const dept = await departmentsModel.find({name})
        // console.log(dept)
        if(dept && dept.length != 0) return res.status(200).send({
            message:"تمت العملية بنجاح ",
            data: dept
        })
        else return res.status(404).send({
            message:" يرجي ادخال بيانات صحيحه  ",
            data: ""
        })
    }
    catch(e){
        res.status(500).send({
            message:"حدث خطأ في الخادم الداخلي",
            date:e
        })
    }
}


const departmentSearch = async(req, res)=>{
    const name = req.body.name.trim()
    try{
        const departments = await departmentsModel.find()
        const searchResult = departments.filter((item) => {
            // console.log(item)
            const x = item.name.search(name)
            // console.log(x)
            if (x != -1) return item
        })
        // console.log(searchResult)
        if(searchResult && searchResult.length != 0) return res.status(200).send({
            message:"تمت العملية بنجاح ",
            data: searchResult
        })
        else return res.status(404).send({
            message:" يرجي ادخال بيانات صحيحه  ",
            data: ""
        })
    }
    catch(e){
        res.status(500).send({
            message:"حدث خطأ في الخادم الداخلي",
            date:e
        })
    }
}


module.exports = {
    departmentIndex,
    departmentDetails,
    departmentCreate,
    departmentUpdate,
    departmentDelete,
    departmentEmployees,
    departmentAddChild,
    departmentSearch
}