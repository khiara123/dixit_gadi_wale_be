const Employee = require("../model/employeeModel");
const puppeteer = require("puppeteer");
const { format } = require("date-fns");

module.exports.getAllEmployee = async (req, res, next) => {
  try {
    const page = req?.query?.page || 1;
    const limit = req?.query.limit || 10;
    const skip = (page - 1) * limit;
    const [employees, totalCount] = await Promise.all([
      Employee.find()
        .sort({ createdAt: -1 })
        .populate("address")
        .populate("tripInformation")
        .populate("bookingInformation")
        .skip(skip)
        .limit(limit),
      Employee.countDocuments(),
    ]);
    if (!employees) {
      res.status(500).send({ message: "something went wrong" });
      return;
    }

    await res.status(200).send({
      data: employees,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCount / limit),
      totalRecords: totalCount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "something went wrong" });
  }
};

module.exports.saveEmployee = async (req, res, next) => {
  try {
    const employee = new Employee(req.body);
    const savedEmployee = await employee.save();
    if (!savedEmployee) {
      console.log("its come here");
      res.status(500).send({ message: "something went wrong" });
      return;
    }
    await res.status(200).send(savedEmployee);
  } catch (error) {
    console.log("its come here in error section", error);
    res.status(500).send({ message: "something went wrong" });
  }
};

module.exports.editEmployee = async (req, res, next) => {
  try {
    const employeeId = req.params.id;
    const {
      firstName,
      lastName,
      isActive,
      profilePhoto,
      mobileNumber,
      dlNumber,
      alternateMobileNumber,
      dateOfBirth,
      addharNumber,
      address,
      bookingInformation,
      tripInformation,
    } = req.body;
    const employee = await Employee.findById(employeeId);
    if (employee) {
      employee.firstName = firstName;
      employee.lastName = lastName;
      employee.isActive = isActive;
      employee.profilePhoto = profilePhoto;
      employee.dateOfBirth = dateOfBirth;
      employee.mobileNumber = mobileNumber;
      employee.dlNumber = dlNumber;
      employee.alternateMobileNumber = alternateMobileNumber;
      employee.addharNumber = addharNumber;
      employee.address = address;
      employee.bookingInformation = bookingInformation;
      employee.tripInformation = tripInformation;
      await employee.save(employee);
      res.status(200).send({ status: 200, employee: employee });
    } else {
      res.status(404).send("No employee find with this id");
    }
  } catch (error) {
    console.log("errroror", error);
    res.status(500).send("somethig went wrong");
  }
};

module.exports.removeEmpolyee = async (req, res, next) => {
  try {
    const id = req.params.id;
    const employee = await Employee.findByIdAndDelete(id);
    if (employee) {
      console.log("delted employee", employee);
      res.status(200).send({ status: 200, employee: employee });
    } else {
      res.status(404).send("No employee find with this id");
    }
  } catch (error) {
    console.log("errroror", error);
    res.status(500).send("somethig went wrong");
  }
};

module.exports.printEmployee = async (req, res, next) => {
  const { id } = req.params; // Capture the employee ID if needed
  const employee = await Employee.findById(id);

  const htmlContent = `
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>User Details PDF</title>
  <style>
    body {
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      font-size: 15px;
      color: #333;
      margin: 0px 40px 40px 40px;
    }

    h2 {
      margin-bottom: 8px;
      color: #2c3e50;
      border-bottom: 1px solid #ccc;
      padding-bottom: 4px;
    }

    .section {
      margin-bottom: 25px;
    }

    .profile {
      display: flex;
      align-items: flex-start;
      gap: 20px;
    }

    .profile-photo {
      max-width: 125px;
      max-height: 135px;
      width: 125px;
      height: 135px;
      border-radius: 8px;
      border: 1px solid #ccc;
      object-fit: contain;
    }

   .info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px 40px; /* space between rows and columns */
}

.info-grid p {
  display: flex;
  align-items: baseline;
  margin: 0;
}

.label {
  min-width: 140px;
  font-weight: bold;
  color: #333;
  display: inline-block;
  white-space: nowrap;
}
 .terms-title {
      text-align: center;
      font-size: 22px;
      font-weight: bold;
      margin-bottom: 20px;
      text-decoration: underline;
    }
    ol {
      font-size: 10px;
      line-height: 1.2;
      padding-left: 20px;
      font-style: italic;
    }
    .signature-container {
      display: flex;
      justify-content: space-between;
      margin-top: 60px;
    }

    .signature-label {
      font-size: 14px;
      font-weight: bold;
      color: #333;
      border-top: 1px solid #aaa;
      padding-top: 4px;
      width: 200px;
      text-align: center;
    }
  </style>
</head>
<body>

  <!-- Header -->
  <div style="border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px;">
    <div style="display: flex; justify-content: center; align-items: center; font-size: 12px;">
      <div>Delivery Challan</div>
    </div>
    <div style="text-align: center; margin-top: 5px;">
      <h1 style="margin: 0; font-size: 32px; color: #1a1a1a;">Dixit Gadi Wale</h1>
      <div style="font-weight: bold; font-size: 14px;">A Unit of Dixit Insurance Fincorp</div>
      <div style="font-size: 13px;">C-11, Opp. B.S.A., Engineering College, Mathura</div>
      <div style="font-size: 13px;">
        Phone: 8266006000, 8266001000, 8265950000 | Email: dixitgadiwale@gmail.com
      </div>
    </div>
  </div>
  <div style="text-align: center; font-weight: bold; font-size: 15px; margin-top: -15px; margin-bottom: 15px; padding-top: 5px;">
  Morning 6:00 AM To 8:30 PM Will be calculated as one day<br>
  Security deposite 1000/- Refundable
</div>

  <!-- Personal Information -->
  <div class="section">
    <h2>Personal Information</h2>
    <div class="profile">
      <img class="profile-photo" src=${
        employee?.profilePhoto
      } alt="Profile Photo" />
      <div class="info-grid">
        <p><span class="label">Name:</span>${employee?.firstName} ${
    employee?.lastName
  }</p>
        <p><span class="label">Gender:</span> Male</p>
        <p><span class="label">DOB:</span> ${format(
          employee?.dateOfBirth,
          "dd/MM/yyyy"
        )}</p>
        <p><span class="label">Aadhaar Number:</span> ${
          employee?.addharNumber
        }</p>
        <p><span class="label">Mobile Number:</span> ${
          employee?.mobileNumber
        }</p>
         <p><span class="label">Alternate Number:</span> ${
           employee?.alternateMobileNumber
         }</p>
        <p><span class="label">DL Number:</span> ${employee?.dlNumber}</p>
        <p><span class="label">Address:</span> ${employee?.address?.street1} ${
    employee?.address?.street2
  }</p>
       <p><span class="label">City:</span> ${employee?.address?.city}</p>
       <p><span class="label">State:</span> ${employee?.address?.state}</p>
       <p><span class="label">Pincode:</span> ${
         employee?.address?.postalCode
       }</p>
      </div>
    </div>
  </div>

  <!-- Booking Information -->
  <div class="section">
    <h2>Booking Information</h2>
    <div class="info-grid">
      <p><span class="label">Pickup Date & Time: </span> ${format(
        employee?.bookingInformation?.pickupDateAndTime,
        "dd/MM/yyyy HH:mm a"
      )}</p>
      <p><span class="label">Drop Date & Time: </span> ${format(
        employee?.bookingInformation?.dropDateAndTime,
        "dd/MM/yyyy HH:mm a"
      )}</p>
      <p><span class="label">Vehicle Name: </span> ${
        employee?.bookingInformation?.vichelName
      }</p>
       <p><span class="label">Vehicle Number: </span> ${
         employee?.bookingInformation?.vichelNumber
       }</p>
      <p><span class="label">Charges Per Day: </span> ₹${
        employee?.bookingInformation?.chargePerDay
      }</p>
      <p><span class="label">Refundable Amount: </span> ₹${
        employee?.bookingInformation?.refundableAmount
      }</p>
      <p><span class="label">Total Payable Amount: </span> ₹${
        employee?.bookingInformation?.totalPayable
      }</p>
    </div>
  </div>

  <!-- Trip Information -->
  <div class="section">
    <h2>Trip Information</h2>
      ${employee?.tripInformation?.map((trip) => {
        return `<div class="info-grid">
      <p><span class="label">Hotel Name:</span> ${trip?.hotelName || "N/A"}</p>
       <p><span class="label">Room Number:</span> ${
         trip?.roomNumber || "N/A"
       }</p>
      <p><span class="label">Checkin Date:</span>${
        trip?.checkedInDate ? format(trip.checkedInDate, "dd/MM/yyyy") : "N/A"
      }</p>
      <p><span class="label">Checkout Date:</span>${
        trip?.checkoutDate ? format(trip.checkoutDate, "dd/MM/yyyy") : "N/A"
      }</p>
      </br>
    </div>`;
      })}
    
    
  </div>
  <!-- Term and condition -->
   <div class="terms-title">Terms and Conditions</div>
  <ol>
    <li>The driver must have a valid driving license.</li>
    <li>Wearing a helmet is mandatory (helmet will be provided free with the vehicle).</li>
    <li>The security amount will be returned upon returning the vehicle.</li>
    <li>A fine will be charged for riding without a helmet.</li>
    <li>The vehicle must not be used for any illegal or unauthorized activities, and it cannot be handed over to another person. All traffic rules must be followed. The driver will be solely responsible for any violations.</li>
    <li>You will be held liable for any damage to the vehicle or harm caused to third parties during its use.</li>
    <li>Failure to return the vehicle on time will result in additional rental charges for the extra day(s).</li>
    <li>Vehicles are not allowed to be taken outside Mathura district. Violation will result in a penalty.</li>
    <li>It is mandatory for the customer to record a video of the vehicle at the time of pickup to avoid any disputes regarding damage later.</li>
    <li>In case of any dispute, the jurisdiction will be in Mathura.</li>
  </ol>

  <!-- Footer Signature -->
  <div class="signature-container">
    <div class="signature-label">Customer Signature</div>
    <div class="signature-label">Authorized Signature</div>
  </div>

</body>
</html>


  `;

  try {
    const browser = await puppeteer.launch({
      headless: "new", // For compatibility with Docker/headless
      args: ["--no-sandbox", "--disable-setuid-sandbox"], // Recommended for some server environments
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      displayHeaderFooter: true,
      headerTemplate: `<div style="height: 0px;"></div>`,
      footerTemplate: `
       <div style="
    font-size:10px;
    width:100%;
    padding: 0 40px;
    display: flex;
    justify-content: space-between;
    color: #2C3E50;
  ">
    <div><strong style="font-size: 12px;">Dixit Gadi Wale</strong></div>
    <div>
      Page <span class="pageNumber"></span> of <span class="totalPages"></span>
    </div>
  </div>
      `,
      margin: {
        top: "80px",
        bottom: "60px",
      },
    });
    console.log("PDF Buffer size:", pdfBuffer.length);
    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=employee.pdf",
    });

    res.end(pdfBuffer);
  } catch (err) {
    console.error("PDF generation failed:", err);
    res.status(500).send("PDF generation failed");
  }
};

module.exports.genrateOtp = async (req, res, next) => {
  try {
    res
      .status(200)
      .send({ status: 200, message: "otp sent to register mobile number" });
  } catch (error) {
    console.log("Error in Otp genration");
    res
      .status(500)
      .send({ status: 500, error: error, message: "somethig went wrong" });
  }
};

module.exports.verifyOtp = async (req, res, next) => {
  try {
    res.status(200).send({ status: 200, message: "otp verify successfully" });
  } catch (error) {
    console.log("Error in Otp verification");
    res
      .status(500)
      .send({ status: 500, error: error, message: "somethig went wrong" });
  }
};
