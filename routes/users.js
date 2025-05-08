var express = require("express");
var router = express.Router();
var userController = require("../controller/userController");
var verfiyUser = require("../middelware/registerUser");
var userAuthentication = require("../middelware/auth");

/* GET users listing. */
/**
 * @swagger
 * components:
 *  schemas:
 *    CreateUserInput:
 *      type: object
 *      required:
 *        - email
 *        - firstName
 *        - lastName
 *        - password
 *      properties:
 *        email:
 *          type: string
 *          default: jane.doe@example.com
 *        firstName:
 *          type: string
 *          default: Jane Doe
 *        lastName:
 *          type: string
 *          default: stringPassword123
 *        password:
 *          type: string
 *          default: stringPassword123
 *    CreateUserResponse:
 *      type: object
 *      properties:
 *        message:
 *          type: string
 *        data:
 *          type: object
 *          properties:
 *            firstName:
 *             type: string
 *            lastName:
 *             type: string
 *            password:
 *             type: string
 *            email:
 *             type: string
 *            _id:
 *              type: string
 *    LoginUserRequest:
 *      type: object
 *      required:
 *          - email
 *          - password
 *      properties:
 *          email:
 *            type: string
 *            default: example@gmail.com
 *          password:
 *             type: string
 *             default: ankit@123
 *    LoginUserResponse:
 *      type: object
 *      properties:
 *        message:
 *          type: string
 *        data:
 *          type: object
 *          properties:
 *            email:
 *              type: string
 *            name:
 *              type: string
 *            roles:
 *              type: array
 *              items:
 *                type: string
 *        token:
 *          type: string
 *    ForgotPasswordRequest:
 *      type: object
 *      required:
 *          - email
 *          - newPassword
 *      properties:
 *          email:
 *            type: string
 *            default: example@gmail.com
 *          newPassword:
 *             type: string
 *             default: ankit@123
 *    ForgotPasswordResponse:
 *      type: object
 *      properties:
 *        message:
 *          type: string
 *        email:
 *          type: string
 */

/**
 * @openapi
 * /users:
 *  get:
 *     tags:
 *     - User
 *     description: List of all the user exist
 *     responses:
 *       200:
 *         description: List all the user exist
 */
router.get("/", userController.getAllUser);

/**
 * @openapi
 * /users/singup:
 *  post:
 *     tags:
 *     - User
 *     summary: Register a user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/CreateUserInput'
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateUserResponse'
 *       500:
 *         description: something went wrong
 *       400:
 *         description: Bad request
 */
router.post(
  "/singup",
  [verfiyUser.checkDuplicateUser, verfiyUser.checkUserRole],
  userController.registerUser
);

/**
 * @openapi
 * /users/login:
 *  post:
 *     tags:
 *     - User
 *     summary: login user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/LoginUserRequest'
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginUserResponse'
 *       500:
 *         description: something went wrong
 *       400:
 *         description: Bad request
 */
router.post(
  "/login",
  [userAuthentication.checkUserEmailAndPassword],
  userController.loginUser
);
/**
 * @openapi
 * /users/verify:
 *  get:
 *     tags:
 *     - User
 *     description: verify user is exist in the system
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *             email:
 *               type: string
 *               default: 'example@gmail.com'
 *      responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               email:
 *                 type: string
 *               message: 
 *                 type: string
 *       500:
 *         description: something went wrong
 *       400:
 *         description: Bad request
 */
router.get("/verify", [verfiyUser.userVerification], userController.verifyUser);

/**
 * @openapi
 * /users/forgotPassword:
 *  post:
 *     tags:
 *     - User
 *     summary: forgot user password
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/ForgotPasswordRequest'
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForgotPasswordResponse'
 *       500:
 *         description: something went wrong
 *       400:
 *         description: Bad request
 */
router.post("/forgotPassword", [verfiyUser.userVerification], userController.forgotPassword);

router.get("/verifyUserToken", [userAuthentication.verifyToken], userController.verifyUserToken)

router.post("/enquiry", userController.userInquiry)

module.exports = router;
