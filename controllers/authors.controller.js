const pool = require("../config/db");
const { errorHandler } = require("../helpers/error_handler");

const addNewAuthor = async (req, res) => {
  try {
    const { user_id, is_approved, is_editor } = req.body;
    const newAuthor = await pool.query(
      `INSERT INTO authors (user_id,is_approved,is_editor)
        VALUES ($1, $2, $3) RETURNING *
        `,
      [user_id, is_approved, is_editor]
    );

    res
      .status(201)
      .send({ message: "Yangi aftor qo'shildi", author: newAuthor.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllAuthors = async (req, res) => {
  try {
    const results = await pool.query("SELECT * FROM authors");
    res.send(results.rows);
  } catch (error) {
    errorHandler(error, res);
    res.send("Malumot olishda xatolik");
  }
};

const getAuthorById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await pool.query(`SELECT * FROM authors where id=${id}`);
    res.send(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.send("Malumot olishda xatolik");
  }
};

const updateAuthorById = async (req, res) => {
  const { user_id, is_approved, is_editor } = req.body;
  const id = req.params.id;
  await pool.query(
    `UPDATE authors set user_id=$1, is_approved=$2, is_editor=$3 where id=${id}`,
    [user_id, is_approved, is_editor]
  );
  const result = await pool.query(`SELECT * FROM authors where id=${id}`);

  res.status(200).send({
    message: "Malumotlar muvaffaqqiyatli yangilandi",
    author: result.rows[0],
  });
};

const deleteAuthor = async (req, res) => {
  const id = req.params.id;
  const result = await pool.query(`SELECT * FROM authors where id=${id}`);
  await pool.query(`DELETE FROM authors where id=${id}`);
  res.status(201).send({
    message: "Malumotlar muvaffaqqiyatli o'chirildi",
    author: result.rows[0],
  });
};

module.exports = {
  addNewAuthor,
  getAllAuthors,
  getAuthorById,
  updateAuthorById,
  deleteAuthor,
};
