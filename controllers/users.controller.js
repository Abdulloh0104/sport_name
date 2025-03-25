const pool = require("../config/db");
const { errorHandler } = require("../helpers/error_handler");

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
    const newUser = await pool.query(
      `INSERT INTO users (first_name ,last_name,email,password,role,is_active,created_at,interests,bookmarks)
        VALUES ($1, $2,$3,$4,$5,$6,$7,$8,$9) RETURNING *
        `,
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

    res
      .status(201)
      .send({ message: "Yangi user qo'shildi", user: newUser.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllUsers = async (req, res) => {
  try {
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
  await pool.query(
    `UPDATE users set first_name=$1 ,last_name=$2,email=$3,password=$4,role=$5,is_active=$6,created_at=$7,interests=$8,bookmarks=$9 where id=${id}`,
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
  const result = await pool.query(`SELECT * FROM users where id=${id}`);

  res.status(200).send({
    message: "Malumotlar muvaffaqqiyatli yangilandi",
    user: result.rows[0],
  });
};

const deleteUser = async (req, res) => {
  const id = req.params.id;
  const result = await pool.query(`SELECT * FROM users where id=${id}`);
  await pool.query(`DELETE FROM users where id=${id}`);
  res.status(201).send({
    message: "Malumotlar muvaffaqqiyatli o'chirildi",
    user: result.rows[0],
  });
};

module.exports = {
  addNewUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUser,
};
