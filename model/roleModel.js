const mongoose = require("mongoose");

//  role Schema
const roleSchema = new mongoose.Schema({
   name: {
    type: String
   }
})

const Role = mongoose.model('role', roleSchema);
module.exports = Role