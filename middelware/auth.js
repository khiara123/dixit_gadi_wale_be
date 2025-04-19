const User = require("../model/userModel");
const Role = require("../model/roleModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config")

const checkUserEmailAndPassword = async (req, res, next) => {
   if(!req.body.email || !req.body.password) {
      res.status(400).send({message: "Invalid request"});
      return;
   } else {
       try {
            const user = await User.findOne({email: req.body.email});
            if(!user) {
                res.status(400).send({message: "user does not exist"});
                return;
            }
            const matchPassword = await bcrypt.compare(req.body.password, user.password);
            if(!matchPassword) {
                res.status(400).send({message: "Invalid Credentials"});
                return
            }
       } catch(error) {
        res.status(500).send({message: "Something Went wrong"});
       }
   }
  next();

};


const verifyToken = async(req, res, next) =>  {
  const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.decode(token);
      console.log("decoded token", decoded);
      console.log("request session id  at verify", req.sessionID);
      //console.log("request session id  at verify", req.session.userId);

      if (!decoded) {
        
        return res.status(500).send({message: 'something went wrong'});
      }
      // if(decoded.seesionId !== req.sessionID) {
      //   return res.status(401).send({message: "Unatherized access"});
      // }
      jwt.verify(token, config.JWT_SECRET, (err, user) => {
          if (err) {
            res.status(401).send({message: "Unatherized access"});
          }
          req.user = user;
          next();
      });
  } else {
      res.status(401).send({message: "Unatherized access"});
  }
   // next();
}



const userAuthentication = {
  checkUserEmailAndPassword,
  verifyToken
};

module.exports = userAuthentication;