const pool = require("../config/db");
const { errorHandler } = require("../helpers/error_handler");

const addNewNewsTag = async (req, res) => {
  try {
    const { news_id, tag_id } = req.body;
    const newNewsTag = await pool.query(
      `INSERT INTO news_tags (news_id, tag_id)
        VALUES ($1, $2) RETURNING *
        `,
      [news_id, tag_id]
    );

    res
      .status(201)
      .send({ message: "Yangi news_tags qo'shildi", newsTag: newNewsTag.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllNewsTags = async (req, res) => {
  try {
    const results = await pool.query("SELECT * FROM news_tags");
    res.send(results.rows);
  } catch (error) {
    errorHandler(error, res);
    res.send("Malumot olishda xatolik");
  }
};

const getNewsTagById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await pool.query(`SELECT * FROM news_tags where id=${id}`);
    res.send(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.send("Malumot olishda xatolik");
  }
};

const updateNewsTagById = async (req, res) => {
  const { news_id, tag_id } = req.body;
  const id = req.params.id;
  await pool.query(`UPDATE news_tags set news_id=$1,tag_id=$2 where id=${id}`, [
    news_id,
    tag_id,
  ]);
  const result = await pool.query(`SELECT * FROM news_tags where id=${id}`);

  res.status(200).send({
    message: "Malumotlar muvaffaqqiyatli yangilandi",
    newsTag: result.rows[0],
  });
};

const deleteNewsTag = async (req, res) => {
  const id = req.params.id;
  const result = await pool.query(`SELECT * FROM news_tags where id=${id}`);
  await pool.query(`DELETE FROM news_tags where id=${id}`);
  res
    .status(201)
    .send({
      message: "Malumotlar muvaffaqqiyatli o'chirildi",
      newsTag: result.rows[0],
    });
};

module.exports = {
  addNewNewsTag,
  getAllNewsTags,
  getNewsTagById,
  updateNewsTagById,
  deleteNewsTag,
};
