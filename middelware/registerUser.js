const User = require("../model/userModel");
const Role = require("../model/roleModel");

const checkDuplicateUser = async (req, res, next) => {
  if (req.body.email) {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        res.status(400).send({ message: "Failed! Email is already in use!" });
        return;
      }
    } catch (error) {
      res.status(500).send({ message: err });
      return;
    }
    next();
    return;
  }
  res.status(500).send({ message: err });
  return;
};

const checkUserRole = async (req, res, next) => {
  let roles = [];
  try {
    const availableUserRole = await Role.find();
    if (availableUserRole) {
      roles = availableUserRole.map((role) => {
        return role.name;
      });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "something went wrong while fetching the role" });
    return;
  }
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!roles.includes(req.body.roles[i])) {
        res.status(400).send({
          message: `Failed! Role ${req.body.roles[i]} does not exist!`,
        });
        return;
      }
    }
  }

  next();
};

const userVerification  = async (req, res, next) => {
  if (req.body.email) {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        res.status(400).send({ message: "user does not exist" });
        return;
      }
    } catch (error) {
      res.status(500).send({ message: err });
      return;
    }
    next();
    return;
  }
  res.status(500).send({ message: err });
  return;
}
const verfiyUser = {
  checkDuplicateUser,
  checkUserRole,
  userVerification
};

module.exports = verfiyUser;
