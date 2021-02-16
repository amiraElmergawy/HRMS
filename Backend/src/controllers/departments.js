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
        ...req.body,
        parent: { default: "" }
    })
    // console.log(departmentData)
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
            message: 'هذا القسم موجود بالفعل',
            data: e // to display only error message should access e.errors.name.message
        })
    }
}

const departmentUpdate = async (req, res) => {
    const _id = req.params.id
    avlUpdates = ['name', 'head']
    const keys = Object.keys(req.body)
    // let childsFlag = false;
    try {
        const department = await departmentsModel.findById(_id)
        if (!department) return res.status(404).send({
            message: 'هذه البيانات غير موجوده',
            // data: {}
        })
        const flag = keys.every((key) => {
            // console.log(department, req.body)
            const flag = avlUpdates.includes(key)
            switch (key) {
                case 'name':
                    department.name = req.body.name
                    break;
                case 'head':
                    department.head = req.body.head
                    break;
                default:
                    break;
            }
            return flag;
        })
        if (!flag) return res.status(405).send({
            message: "غير مسموح بهذا التحديث",
            data: ""
        })
        await department.save()
        res.status(200).send({
            message: "تمت العملية بنجاح",
            data: department
        })
    }
    catch (e) {
        res.status(500).send({
            data: e,
            // message: e
        })
    }
}

const departmentDelete = async (req, res) => {
    const _id = req.params.id
    try {
        const department = await departmentsModel.findById(_id)
        if (!department) {
            return res.status(404).send({
                message: 'هذه البيانات غير موجوده',
                data: ''
            })
        }
        else {
            // department.childs.forEach((dept) => {
            // });
            // console.log(department)
            await department.populate('employees').execPopulate()
            // console.log(department.employees)
            if (department.employees.length > 0 || department.childs.length > 0) {
                res.status(405).send({
                    message: 'لا يسمح بمسح هذا القسم لوجود عاملين به',
                    data: department.employees
                })
            }
            else {
                department.remove()
                res.status(200).send({
                    message: "تمت العملية بنجاح",
                    data: ""
                })
            }
        }
    }
    catch (e) {
        res.status(500).send({
            message: e,
        })
    }
}

const departmentEmployees = async (req, res) => {
    const _id = req.params.id
    try {
        const dept = await departmentsModel.findById(_id) // return department of this id
        if (dept) {
            await dept.populate('employees').execPopulate()
            if (dept.employees.length > 0) {
                return res.status(200).send({
                    message: "تمت العملية بنجاح",
                    data: dept.employees
                })
            }
            else {
                res.status(200).send({
                    message: "تمت العملية بنجاح",
                    data: []
                })
            }
        }
        else {
            return res.status(404).send({
                message: "لا توجد بيانات",
                data: ''
            })
        }
    }
    catch (e) {
        res.status(500).send({
            message: "يوجد خطأ في الخادم الداخلي",
            data: e
        })
    }

}


const departmentAddChild = async (req, res) => {
    // take the parent id and child id
    // check if the not already exist, child not the parent itself, and child not already related with any other parent
    // find the parent by id, push child to its childs' array, and add parent dept to childParent property
    const _id = req.params.id
    childId = req.body._id
    // console.log(_id, child)
    try {
        const dept = await departmentsModel.findById(_id)
        const child = await departmentsModel.findById(childId)
        // console.log(child)
        if (!dept) return res.status(404).send({
            message: 'القسم غير موجود'
        })
        else {
            const flag = dept.childs.find(deptChild => deptChild._id == childId)
            // const flag = dept.childs.indexOf(child)
            console.log(flag)
            if (dept._id == childId) return res.status(405).send({
                message: ' غير مسموح ربط القسم بنفسه ',
                // data: {}
            })
            // console.log(child.parent._id)
            if (child.parent._id) return res.status(405).send({
                message: ' لا يمكن ربط هذا القسم ',
                // data: {}
            })
            if (!flag) { // to check that current child not added before
                // const parent = dept
                child.parent = {
                    _id: dept._id
                }
                await child.save()
                // console.log(child)
                dept.childs.push(child)
                await dept.save()
                // console.log(child.parent)
                // console.log(dept.childs)
                // dept.childs[dept.childs.length -1] = child
                return res.status(200).send({
                    message: 'تمت العملية بنجاح',
                    data: dept
                })
            }
            else return res.status(405).send({
                message: ' هذا القسم موجود بالفعل ',
                // data: {}
            })
        }
    }
    catch (e) {
        res.status(500).send({
            message: "حدث خطأ في الخادم الداخلي",
            data: e // to display only error message should access e.errors.name.message
        })
    }
}

const departmentRemoveChild = async (req, res) => {
    const _id = req.params.id
    childId = req.body._id
    // console.log(_id, child)
    try {
        const dept = await departmentsModel.findById(_id)
        const child = await departmentsModel.findById(childId)
        dept.childs = dept.childs.filter(ele => ele._id != childId)
        child.parent = { default:"" }
        dept.save()
        child.save()
        res.status(200).send({
            message: "تم الغاءالربط بنجاح",
            data: {dept, child}
        })
    }
    catch (e) {
        res.status(500).send({
            message: "حدث خطأ في الخادم الداخلي",
            data: e // to display only error message should access e.errors.name.message
        })
    }
}

// const departmentSearch1 = async (req, res) => {
//     const name = req.body.name
//     try {
//         const dept = await departmentsModel.find({ name })
//         if (dept && dept.length != 0) return res.status(200).send({
//             message: "تمت العملية بنجاح ",
//             data: dept
//         })
//         else return res.status(404).send({
//             message: " يرجي ادخال بيانات صحيحه  ",
//             data: ""
//         })
//     }
//     catch (e) {
//         res.status(500).send({
//             message: "حدث خطأ في الخادم الداخلي",
//             date: e
//         })
//     }
// }


const departmentSearch = async (req, res) => {
    const name = req.body.name.trim()
    try {
        const departments = await departmentsModel.find()
        const searchResult = departments.filter((item) => {
            const x = item.name.search(name)
            if (x != -1) return item
        })
        if (searchResult && searchResult.length != 0) return res.status(200).send({
            message: "تمت العملية بنجاح ",
            data: searchResult
        })
        else return res.status(404).send({
            message: "لا توجد نتائج للبحث تأكد من ادخال بيانات صحيحه ",
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


module.exports = {
    departmentIndex,
    departmentDetails,
    departmentCreate,
    departmentUpdate,
    departmentDelete,
    departmentEmployees,
    departmentSearch,
    departmentAddChild,
    departmentRemoveChild
}