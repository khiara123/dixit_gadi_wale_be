const User = require("../model/userModel");
const Role = require("../model/roleModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");

module.exports.getAllUser = (req,res, next) => {
    res.send("list of all user")
}

module.exports.registerUser = async (req, res,next) => {
   const salt = await bcrypt.genSaltSync(10);
   const hashPassword = await bcrypt.hash(req.body.password, salt)
   const user  = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password:hashPassword
   });
   if(req.body.roles) {
    try {
        const role = await Role.find({name : {$in : req.body.roles}});
        if(role && role.length) {
           const filteredRoles = role.map((roleItem) => roleItem._id);
           user.roles = filteredRoles
        }

        const saveuser = await user.save()
        if (saveuser) {
            res.status(200).send({message: "user created successfully" , data: saveuser})
        }
    } catch(error) {
        res.status(500).send({message: error.message})
    }
   } else {
          try {
            const role = await Role.find({name : "user"});
            if(role && role.length) {
               const filteredRoles = role.map((roleItem) => roleItem._id);
               user.roles = filteredRoles
            }
    
            const saveuser = await user.save()
            if (saveuser) {
                res.status(200).send({message: "user created successfully" , data: saveuser})
            }
        } catch(error) {
            res.status(500).send({message: error.message})
        }
   }
    

}

module.exports.loginUser = async (req, res,next) => {
   try {
    const  user = await User.findOne({email: req.body.email});
    if(user) {
      console.log("req.session.id at login", req.session.id);
       // req.session.userId = req.session.id;
        const token = await jwt.sign({ seesionId:req.session.id , email: user.email }, config.JWT_SECRET, {
            algorithm: 'HS256',
            allowInsecureKeySizes: true,
            expiresIn: '7d',
            });

         const findRoleById =  await Promise.all (user.roles.map(async(role, index) => {
            const filteredRole =  await Role.findById(role);
              return  filteredRole.name;
         }));

      res.status(200).send({
        message: "success",
        data: {
            email: user.email,
            name: user.firstName + ' ' + user.lastName,
            roles: findRoleById,
        },
        token: token
      })
    }

   } catch (error) {
       res.status(500).send({message: "somthing went wrong"});
   }
   


}

module.exports.verifyUser = async (req, res, next) => {
  res.status(200).send({
    message: "success",
    email: req.body.email
  })
}

module.exports.verifyUserToken = async (req, res, next) => {
  console.log("requested user----->", req.user)
  res.status(200).send({
    message: "success",
    email: req.user.email.email
  })
}

module.exports.forgotPassword = async (req, res, next) => {
    try {
      if(!req.body.newPassword) {
         res.status(400).send({message: "Bad request"});
         return;
      } else {
        const salt = await bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hash(req.body.newPassword, salt);
        const updatePass = await User.findOneAndUpdate({email: req.body.email}, {$set:{password:hashPassword}}, {new: true});
        if(updatePass) {
          res.status(200).send({message: "password is updated sucessfully", email: updatePass.email})
        }
      }
      
    } catch(error) {
        res.status(500).send({message: "something went wrong"});
    }
}



