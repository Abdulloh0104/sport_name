const axios = require("axios");
const config = require("config");

class SmsService {
  async sendSms(phone_number, otp) {
    const formdata = new FormData();
    formdata.append("mobile_phone", phone_number);
    formdata.append("message", "Bu Eskiz dan test");
    // formdata.append("message", `OTP code: ${otp}`);
    formdata.append("form", "4546");

    const conf = {
      method: "post",
      maxBodyLength: Infinity,
      url: config.get("SMS_SERVICE_URL"),
      headers: {
        Authorization: `Bearer ${config.get("SMS_TOKEN")}`,
      },
      data: formdata,
    };
    try {
      const response = await axios(conf);
      return response;
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  async refreshToken() {}
  async getToken() {}
  async getUser() {}
}

module.exports = new SmsService();
