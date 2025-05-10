const User = require("../model/userModel");
const Role = require("../model/roleModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");
const fs = require("fs");
const path = require("path");
const transporter = require("../middelware/mailer");
const cloudinary = require("../middelware/cloudConfig");

module.exports.getAllUser = (req, res, next) => {
  res.send("list of all user");
};

module.exports.registerUser = async (req, res, next) => {
  const salt = await bcrypt.genSaltSync(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: hashPassword,
  });
  if (req.body.roles) {
    try {
      const role = await Role.find({ name: { $in: req.body.roles } });
      if (role && role.length) {
        const filteredRoles = role.map((roleItem) => roleItem._id);
        user.roles = filteredRoles;
      }

      const saveuser = await user.save();
      if (saveuser) {
        res
          .status(200)
          .send({ message: "user created successfully", data: saveuser });
      }
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  } else {
    try {
      const role = await Role.find({ name: "user" });
      if (role && role.length) {
        const filteredRoles = role.map((roleItem) => roleItem._id);
        user.roles = filteredRoles;
      }

      const saveuser = await user.save();
      if (saveuser) {
        res
          .status(200)
          .send({ message: "user created successfully", data: saveuser });
      }
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }
};

module.exports.loginUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      console.log("req.session.id at login", req.session.id);
      // req.session.userId = req.session.id;
      const token = await jwt.sign(
        { seesionId: req.session.id, email: user.email },
        config.JWT_SECRET,
        {
          algorithm: "HS256",
          allowInsecureKeySizes: true,
          expiresIn: "7d",
        }
      );

      const findRoleById = await Promise.all(
        user.roles.map(async (role, index) => {
          const filteredRole = await Role.findById(role);
          return filteredRole.name;
        })
      );

      res.status(200).send({
        message: "success",
        data: {
          email: user.email,
          name: user.firstName + " " + user.lastName,
          roles: findRoleById,
        },
        token: token,
      });
    }
  } catch (error) {
    res.status(500).send({ message: "somthing went wrong" });
  }
};

module.exports.verifyUser = async (req, res, next) => {
  res.status(200).send({
    message: "success",
    email: req.body.email,
  });
};

module.exports.verifyUserToken = async (req, res, next) => {
  console.log("requested user----->", req.user);
  res.status(200).send({
    message: "success",
    email: req.user.email.email,
  });
};

module.exports.forgotPassword = async (req, res, next) => {
  try {
    if (!req.body.newPassword) {
      res.status(400).send({ message: "Bad request" });
      return;
    } else {
      const salt = await bcrypt.genSaltSync(10);
      const hashPassword = await bcrypt.hash(req.body.newPassword, salt);
      const updatePass = await User.findOneAndUpdate(
        { email: req.body.email },
        { $set: { password: hashPassword } },
        { new: true }
      );
      if (updatePass) {
        res
          .status(200)
          .send({
            message: "password is updated sucessfully",
            email: updatePass.email,
          });
      }
    }
  } catch (error) {
    res.status(500).send({ message: "something went wrong" });
  }
};

module.exports.userInquiry = async (req, res, next) => {
  
  try {
    const { name, mobile, carType, pickupCity, dropoffCity, pickupDate, dropoffDate} = req.body;

    if (!name || !mobile) {
      return res.status(400).send({ message: "Bad request" });
    }

    // Load template
    const templatePath = path.join(__dirname, "..", "templates", "inquieryTemplate.html");
    let htmlTemplate = fs.readFileSync(templatePath, "utf-8");

    // Replace placeholders
    const data = { name, mobile, carType, pickupCity, dropoffCity, pickupDate, dropoffDate}; // from req.body
    Object.keys(data).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, "g");
      htmlTemplate = htmlTemplate.replace(regex, data[key] || "");
    });

    // Mail options
    const mailOptions = {
      from: 'dixitgadiwale@gmail.com',
      to: 'dixitgadiwale@gmail.com', // User's email
      subject: `New Inquiry Received - ${name} - ${mobile}`,
      html: htmlTemplate,
    };

    // Send mail
    const info = await transporter.sendMail(mailOptions);

    

    res.status(200).send({ message: "Inquiry submitted successfully", status: 200 });
  } catch (error) {
    console.error("Email sending failed:", error);
    res.status(500).send({ message: "Something went wrong" });
  }
};

module.exports.userGallary = async (req, res, next) => {
  try {
    const data  = await fetchAssetsWithContext()
    if (data && data.length > 0) {
      return  res.status(200).send({data: data, status:200})
    }
    return res.status(200).send({data: [], status:200, message: 'No Image and Video find'})
  } catch(error) {
    res.status(500).send({ message: "Something went wrong" });
  }
  
}

async function fetchAssetsWithContext() {
  const result = await cloudinary.search
    .expression('folder=DixitGadiwale')
    .sort_by('created_at', 'desc')
    .with_field('context')
    .with_field('metadata')
    .max_results(40)
    .execute();
  const assets = result.resources.map(asset => (
    {
    public_id: asset.public_id,
    url: asset.secure_url,
    type: asset.resource_type, // 'image' or 'video'
    format: asset.format,
    title: asset.context?.caption || null,
    description: asset.context?.alt || null,
  }));

  console.log("assests---", assets);
  return assets;
}