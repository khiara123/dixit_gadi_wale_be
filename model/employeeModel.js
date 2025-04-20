const mongoose = require("mongoose");

//address schema
const addressSchema = new mongoose.Schema({
  street1: {
    type: String,
    required: true,
  },
  street2: {
    type: String,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  postalCode: {
    type: String,
    required: true,
  },
});

// booking Schema

const bookingSchema = new mongoose.Schema({
  pickupDateAndTime: {
    type: String,
    required: true,
  },
  dropDateAndTime: {
    type: String,
    required: true,
  },
  vichelName: {
    type: String,
    required: true,
  },
  vichelNumber: {
    type: String,
    required: true,
  },
  chargePerDay: {
    type: String,
    required: true,
  },
  refundableAmount: {
    type: String,
    required: true,
  },
  totalPayable: {
    type: String,
    required: true,
  },
});

// trip information

const tripInformationSchema = new mongoose.Schema(
  {
    hotelName: {
      type: String,
      get: function (val) {
        return val ? val : "N/A";
      },
    },
    roomNumber: {
      type: String,
      get: function (val) {
        return val ? val : "N/A";
      },
    },
    checkedInDate: {
      type: Date,
      default: null,
      get: function (val) {
        return val ? val.toISOString().split("T")[0] : null;
      },
    },
    checkoutDate: {
      type: Date,
      default: null,
      get: function (val) {
        return val ? val.toISOString().split("T")[0] : null;
      },
    },
  },
  {
    toObject: { getters: true, setters: true },
    toJSON: { getters: true, setters: true },
    runSettersOnQuery: true,
  }
);

// Employee Schema
const employeeSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      get: function (val) {
        return val ? val.toISOString().split("T")[0] : val;
      },
      required: true,
    },
    isActive: {
      type: Boolean,
    },
    profilePhoto: {
      type: String,
      required: true,
      validate: () => true,
    },
    mobileNumber: {
      type: String,
      required: true,
      validate: () => true,
    },
    alternateMobileNumber: {
      type: String,
      required: true,
      validate: () => true,
    },
    addharNumber: {
      type: String,
      required: true,
      validate: () => true,
    },
    dlNumber: {
      type: String,
      required: true,
      validate: () => true,
    },
    bookingInformation: bookingSchema,
    address: addressSchema,
    tripInformation: [tripInformationSchema],
  },
   {
    timestamps: true, // ✅ This adds createdAt and updatedAt fields
    toObject: { getters: true, setters: true },
    toJSON: { getters: true, setters: true },
    runSettersOnQuery: true
  }
);

const Employee = mongoose.model("employee", employeeSchema);
module.exports = Employee;
