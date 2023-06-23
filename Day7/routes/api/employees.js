const express = require('express');
const employeesConntroller = require('../../controllers/employeesController');
const ROSLE_LIST = require('../../config/rosle_list');
const verifyRoles = require('../../middleware/verifyRoles')
const router = express.Router();

router.route('/')
    .get(employeesConntroller.getAllEmployees)
    .post(verifyRoles(ROSLE_LIST.Admin, ROSLE_LIST.Editor),employeesConntroller.createNewEmployee)
    .put(verifyRoles(ROSLE_LIST.Admin, ROSLE_LIST.Editor),employeesConntroller.updateEmployee)
    .delete(verifyRoles(ROSLE_LIST.Admin),employeesConntroller.deleteEmployee);

router.route('/:id')
    .get(employeesConntroller.getEmployee);

module.exports = router;