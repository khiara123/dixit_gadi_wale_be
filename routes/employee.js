var express = require("express");
var router = express.Router();
var employeeController = require("../controller/employeeController");
var userAuthentication = require("../middelware/auth")


router.get("/", [userAuthentication.verifyToken], employeeController.getAllEmployee);
router.post("/save",[userAuthentication.verifyToken], employeeController.saveEmployee);
router.post("/edit/:id",[userAuthentication.verifyToken], employeeController.editEmployee);
router.delete("/remove/:id",[userAuthentication.verifyToken], employeeController.removeEmpolyee);
router.post("/print/:id",[userAuthentication.verifyToken], employeeController.printEmployee);
router.post("/genrateOtp",[userAuthentication.verifyToken], employeeController.genrateOtp);
router.post("/verifyOtp",[userAuthentication.verifyToken], employeeController.verifyOtp);

module.exports = router;