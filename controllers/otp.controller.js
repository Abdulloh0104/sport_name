const { addMinutesToDate } = require("../helpers/add_minutes");
const { errorHandler } = require("../helpers/error_handler");
const otpGenerator = require("otp-generator");
const config = require("config");
const mailService = require("../services/mail.service");

const pool = require("../config/db");
const uuid = require("uuid");
const { encode, decode } = require("../helpers/crypt");
const smsService = require("../services/sms.service");

const createOtp = async (req, res) => {
  try {
    const { phone_number, email } = req.body;
    const otp = otpGenerator.generate(4, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const now = new Date();
    const expirationTime = addMinutesToDate(
      now,
      config.get("expiration_minute")
    );

    const newOtp = await pool.query(
      `
        INSERT INTO otp (id,otp,expiration_time)
        VALUES ($1, $2, $3) RETURNING id
        `,
      [uuid.v4(), otp, expirationTime]
    );

    //send otp to SMS, email, bot, ...

    // const response = await smsService.sendSms(phone_number, otp);
    // if (response.status != 200) {
    //   return res.status(503).send({ message: "OTP yuborishda xatolik" });
    // }

    // const message = `Code has been send to user ${phone_number.slice(
    //   phone_number.length - 4
    // )}`;
    const message = `Code has been send to email ${email.substring(
      0,
      1
    )}********${email.slice(email.length - 6)}`;

    const activation_link = uuid.v4();

    await mailService.sendActivationMail(
      email,
      `
      ${config.get("api_url")}/api/users/activate/${activation_link}
      `
    );

    const details = {
      timestamp: now,
      phone_number,
      email: email,
      otp_id: newOtp.rows[0].id,
    };

    const encodedData = await encode(JSON.stringify(details));

    res.status(201).send({ verification_key: encodedData, message });
  } catch (error) {
    errorHandler;
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { verification_key, phone_number, email, otp } = req.body;
    const now = new Date();
    const decodedData = await decode(verification_key);
    const details = JSON.parse(decodedData);
    if (details.phone_number != phone_number) {
      const response = {
        Status: "Failure",
        Message: "OTP bu raqamga yuborilmagan",
      };
      return res.status(400).send(response);
    }

    console.log(details.email != email);
    console.log(details.email, email);
    if (details.email != email) {
      const response = {
        Status: "Failure",
        Message: "OTP bu emailga yuborilmagan",
      };
      return res.status(400).send(response);
    }
    const otpData = await pool.query(`SELECT * FROM otp WHERE id=$1`, [
      details.otp_id,
    ]);

    const otpResult = otpData.rows[0];
    console.log(otpResult);

    // res.send(otpResult);
    if (otpData.rowCount == 0) {
      const response = {
        Status: "Failure",
        Message: "OTP topilmadi",
      };
      return res.status(400).send(response);
    }

    if (otpResult.verified == true) {
      const response = {
        Status: "Failure",
        Message: "OTPdan avval foydalanilgan",
      };
      return res.status(400).send(response);
    }

    if (otpResult.expiration_time < now) {
      const response = {
        Status: "Failure",
        Message: "OTPning vaqti chiqib ketgan ",
      };
      return res.status(400).send(response);
    }

    console.log(otpResult.otp, otp);

    if (otpResult.otp != otp) {
      const response = {
        Status: "Failure",
        Message: "OTP mos emas",
      };
      return res.status(400).send(response);
    }

    await pool.query(
      `
      UPDATE otp SET verified=true WHERE id = $1
      `,
      [otpResult.id]
    );
    let userId, isNew;

    const userData = await pool.query(
      `SELECT * from users WHERE phone_number = $1`,
      [phone_number]
    );

    if (userData.rows.length == 0) {
      const newUser = await pool.query(
        `
        INSERT INTO users (phone_number, is_active,email) VALUES ($1,true,$2) RETURNING id
        `,
        [phone_number, email]
      );
      userId = newUser.rows[0].id;
      isNew = true;
    } else {
      userId = userData.rows[0].id;
      isNew = false;
    }
    //yangi usermi yoki user?
    const response = {
      Status: "Success",
      userId,
      isNew,
    };
    return res.status(200).send(response);
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = { createOtp, verifyOtp };
