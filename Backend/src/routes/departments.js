const express = require('express')
const router = new express.Router()
const departmentsController = require('../controllers/departments')
const auth = require('../middleware/authorization')

// show all deaprtments
router.get('', departmentsController.departmentIndex)

// show one deprtmant
router.get('/:id', departmentsController.departmentDetails)

// create new department
router.post('', departmentsController.departmentCreate)

// update department by id
router.patch('/:id',auth, departmentsController.departmentUpdate)

// delete department by id
router.delete('/:id',auth, departmentsController.departmentDelete)

// get all department employees
router.get('/:id/employees', departmentsController.departmentEmployees)

// add child to department
router.post('/:id/addChild', departmentsController.departmentAddChild)

// search for department by name
router.post('/search',departmentsController.departmentSearch)

module.exports = router