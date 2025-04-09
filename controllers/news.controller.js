const pool = require("../config/db");
const { errorHandler } = require("../helpers/error_handler");

const addNewNew = async (req, res) => {
  try {
    const {
      news_id,
      category_id,
      author_id,
      status,
      published_at,
      source
    } = req.body;
    const newNew = await pool.query(
      `INSERT INTO news (news_id,
      category_id,
      author_id,
      status,
      published_at,
      source)
        VALUES ($1, $2,$3,$4,$5,$6) RETURNING *
        `,
      [news_id, category_id, author_id, status, published_at, source]
    );

    res
      .status(201)
      .send({ message: "Yangi new qo'shildi", new: newNew.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllNews = async (req, res) => {
  try {
    const results = await pool.query("SELECT * FROM news");
    res.send(results.rows);
  } catch (error) {
    errorHandler(error, res);
    res.send("Malumot olishda xatolik");
  }
};

const getNewById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await pool.query(`SELECT * FROM news where id=${id}`);
    res.send(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.send("Malumot olishda xatolik");
  }
};

const updateNewById = async (req, res) => {
  const {
    news_id,
    category_id,
    author_id,
    status,
    published_at,
    source,
  } = req.body;
  const id = req.params.id;
  await pool.query(
    `UPDATE news set news_id=$1, category_id=$2,author_id=$3,status=$4,published_at=$5,source=$6 where id=${id}`,
    [news_id, category_id, author_id, status, published_at, source]
  );
  const result = await pool.query(`SELECT * FROM news where id=${id}`);

  res.status(200).send({
    message: "Malumotlar muvaffaqqiyatli yangilandi",
    new: result.rows[0],
  });
};

const deleteNew = async (req, res) => {
  const id = req.params.id;
  const result = await pool.query(`SELECT * FROM news where id=${id}`);
  await pool.query(`DELETE FROM news where id=${id}`); // RETURNING * tekshirib ko'rishim kerak
  res.status(201).send({
    message: "Malumotlar muvaffaqqiyatli o'chirildi",
    new: result.rows[0],
  });
};

module.exports = {
  addNewNew,
  getAllNews,
  getNewById,
  updateNewById,
  deleteNew,
};
