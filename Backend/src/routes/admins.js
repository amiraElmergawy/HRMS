const express = require('express')
const router = new express.Router()
const adminsController = require('../controllers/admins')
const auth = require('../middleware/authorization')


// show all admins
router.get('', auth, adminsController.adminIndex)

// show one admin
router.get('/:id', auth, adminsController.adminDetails)

// create new admin
router.post('', adminsController.adminCreate)

// update admin by id
router.patch('/:id', auth, adminsController.adminUpdate)

// delete admin by id
router.delete('/:id', auth, adminsController.adminDelete)

// log in
router.post('/logIn', adminsController.adminLogIn)
// log out
router.post('/logOut', auth, adminsController.adminLogOut)

module.exports = router