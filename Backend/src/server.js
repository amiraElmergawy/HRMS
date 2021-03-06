const port = process.env.PORT || 3000
const express = require('express')
require('./db/mongoose')
const cors = require('cors')
const departmentRoutes = require('./routes/departments')
const employeeRoutes = require('./routes/employees')
const adminRoutes = require('./routes/admins')
const app = express()
app.use(cors())
app.use(express.json())
app.use('/departments', departmentRoutes) //only access departmentRoutes if the requestURL begins with '/departments'
app.use('/employees', employeeRoutes)
app.use('/admins', adminRoutes)
app.listen(port)