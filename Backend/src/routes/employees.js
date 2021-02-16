const express = require('express')
const router = new express.Router()
const employeesController = require('../controllers/employees')
const auth = require('../middleware/authorization')


// show all employees
router.get('', employeesController.employeeIndex)

// show one employee
router.get('/:id', employeesController.employeeDetails)

// create new employee
router.post('', employeesController.employeeCreate)

// update employee by id
router.patch('/update/:id', auth, employeesController.employeeUpdate)

// delete employee by id
router.delete('/delete/:id', auth, employeesController.employeeDelete)

// user can serach by inssuranceNo, nId, name, code, job
router.post('/search', employeesController.employeeSearch)

module.exports = router