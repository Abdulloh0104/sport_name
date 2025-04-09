const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwtService = require("../services/jwt.service");
const config = require("config");
const { errorHandler } = require("../helpers/error_handler");
const DeviceDetector = require("node-device-detector");
const DeviceHelper = require("node-device-detector/helper");
const { refreshToken } = require("../services/sms.service");
const detector = new DeviceDetector({
  clientIndexes: true,
  deviceIndexes: true,
  deviceAliasCode: false,
  deviceTrusted: false,
  deviceInfo: false,
  maxUserAgentSize: 500,
});

const addNewUser = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      role,
      is_active,
      created_at,
      interests,
      bookmarks,
    } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 7);


    const newUser = await pool.query(
      `INSERT INTO users (first_name ,last_name,email,password,role,is_active,created_at,interests,bookmarks)
        VALUES ($1, $2,$3,$4,$5,$6,$7,$8,$9) RETURNING *
        `,
      [
        first_name,
        last_name,
        email,
        hashedPassword,
        role,
        is_active,
        created_at,
        interests,
        bookmarks,
      ]
    );

    res
      .status(201)
      .send({ message: "Yangi user qo'shildi", user: newUser.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const userAgent = req.headers["user-agent"];
    // console.log('userAgent', userAgent);
    const result = detector.detect(userAgent);
    console.log("result parse", result);
    console.log(DeviceHelper.isDesktop(result));

    const results = await pool.query("SELECT * FROM users");
    res.send(results.rows);
  } catch (error) {
    errorHandler(error, res);
    res.send("Malumot olishda xatolik");
  }
};

const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await pool.query(`SELECT * FROM users where id=${id}`);
    res.send(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.send("Malumot olishda xatolik");
  }
};

const updateUserById = async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    password,
    role,
    is_active,
    created_at,
    interests,
    bookmarks,
  } = req.body;
  const id = req.params.id;
  const result = await pool.query(
    `UPDATE users set first_name=$1 ,last_name=$2,email=$3,password=$4,role=$5,is_active=$6,created_at=$7,interests=$8,bookmarks=$9 where id=${id} RETURNING *`,
    [
      first_name,
      last_name,
      email,
      password,
      role,
      is_active,
      created_at,
      interests,
      bookmarks,
    ]
  );

  res.status(200).send({
    message: "Malumotlar muvaffaqqiyatli yangilandi",
    user: result.rows[0],
  });
};

const deleteUser = async (req, res) => {
  const id = req.params.id;
  const result = await pool.query(
    `DELETE FROM users where id=${id} RETURNING *`
  );
  res.status(201).send({
    message: "Malumotlar muvaffaqqiyatli o'chirildi",
    user: result.rows[0],
  });
};

const logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    // console.log({"rff":refreshToken});

    if (!refreshToken) {
      return res
        .status(400)
        .send({ message: "Cookieda refresh token topilmadi" });
    }
    let user = await pool.query(`SELECT * FROM users where refresh_token=$1`, [
      refreshToken,
    ]);
    console.log("before", user.rows[0]);
    if (!user.rows[0]) {
      return res
        .status(400)
        .send({ message: "Bunday tokenli foydalanuvchi topilmadi" });
    }

    pool.query(`UPDATE users set refresh_token=$1 where id=$2`, [
      "",
      user.rows[0].id,
    ]);
    res.clearCookie("refreshToken");

    res.send({ message: "User logged out seccessfully", id: user._id }); //, id:user._id
  } catch (error) {
    errorHandler(error, res);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    //Identification
    const userr = await pool.query(`SELECT * FROM users where email=$1 `, [
      email,
    ]);
    const user = userr.rows[0];
    console.log(user);
    console.log("------------------------------");
    // console.log(user);

    if (!user) {
      return res.status(400).send({ message: "Email yoki password no'tog'ri" });
    }
    //autentifikatsiya
    const validPassword = bcrypt.compareSync(password, user.password);
    console.log("validPassword", !validPassword);
    console.log("validPassword", validPassword);
    console.log("password", password, user.password);

    if (!validPassword) {
      return res.status(400).send({ message: "Email yoki password no'tog'ri" });
    } // ishladi
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    const tokens = jwtService.generateTokens(payload);
    await pool.query(`UPDATE users set refresh_token=$1 where email=$2`, [
      tokens.refreshToken,
      email,
    ]);
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_cookie_time"),
    });

    res.send({
      message: "Tizimga xush kelibsiz",
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const refreshTokenUser = async (req, res) => {
  try {
    console.log(req.cookies);
    const { refreshToken } = req.cookies;
    console.log(refreshToken);
    if (!refreshToken) {
      return res
        .status(400)
        .send({ message: "Cookieda refresh token topilmadi" });
    }
    const decodedRefreshToken = await jwtService.verifyRefreshToken(
      refreshToken
    );
    const user = await pool.query(
      `SELECT * FROM users where refresh_token=$1
      `,
      [refreshToken]
    );
    console.log(user.rows[0]);
    if (!user.rows[0]) {
      return res
        .status(400)
        .send({ message: "Bunday tokenli foydalanuvchi topilmadi" });
    }
    const payload = {
      id: user.rows[0].id,
      email: user.rows[0].email,
      role: user.rows[0].role,
    };
    const tokens = jwtService.generateTokens(payload);
    await pool.query(
      `UPDATE users set refresh_token=$1 where id=$2 RETURNING *`,
      [
        tokens.refreshToken,
        user.rows[0].id,
      ]
    );
    // await user.save();
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_cookie_time"),
    });
    res.send({
      message: "Tokenlar yangilandi",
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const activateUser = async (req, res) => {
  try {
    const user = await pool.query(
      `SELECT * FROM users where activation_link=${req.params.link} `
    );

    if (!user.rows[0]) {
      return res
        .status(400)
        .send({ message: "Bunday foydalanuvchi topilmadi" });
    }

    user.rows[0].is_active = true;

    // await user.save();
    res.send({
      message: "Foydalanuvchi faollashtirildi",
      status: user.rows[0].is_active,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addNewUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUser,
  loginUser,
  logoutUser,
  refreshTokenUser,
  activateUser,
};
