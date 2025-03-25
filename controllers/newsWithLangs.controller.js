const pool = require("../config/db");
const { errorHandler } = require("../helpers/error_handler");

const addNewNewsWithLang = async (req, res) => {
  try {
    const { title,content,summary_news, lang_id } = req.body;
    const newNewsWithLang = await pool.query(
      `INSERT INTO news_with_langs (title,content,summary_news, lang_id )
        VALUES ($1, $2,$3,$4) RETURNING *
        `,
      [title, content, summary_news, lang_id]
    );

    res
      .status(201)
      .send({ message: "Yangi yangilik qo'shildi", newsWithLang: newNewsWithLang.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllNewsWithLangs = async (req, res) => {
  try {
    const results = await pool.query("SELECT * FROM news_with_langs");
    res.send(results.rows);
  } catch (error) {
    errorHandler(error, res);
    res.send("Malumot olishda xatolik");
  }
};

const getNewsWithLangById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await pool.query(
      `SELECT * FROM news_with_langs where id=${id}`
    );
    res.send(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.send("Malumot olishda xatolik");
  }
};

const updateNewsWithLangById = async (req, res) => {
  const { title, content, summary_news, lang_id } = req.body;
  const id = req.params.id;
  await pool.query(
    `UPDATE news_with_langs set title=$1,content=$2,summary_news=$3, lang_id=$3  where id=${id}`,
    [title, content, summary_news, lang_id]
  );
  const result = await pool.query(
    `SELECT * FROM news_with_langs where id=${id}`
  );

  res.status(200).send({
    message: "Malumotlar muvaffaqqiyatli yangilandi",
    newsWithLang: result.rows[0],
  });
};

const deleteNewsWithLang = async (req, res) => {
  const id = req.params.id;
  const result = await pool.query(
    `SELECT * FROM news_with_langs where id=${id}`
  );
  await pool.query(`DELETE FROM news_with_langs where id=${id}`);
  res
    .status(201)
    .send({
      message: "Malumotlar muvaffaqqiyatli o'chirildi",
      newsWithLang: result.rows[0],
    });
};

module.exports = {
  addNewNewsWithLang,
  getAllNewsWithLangs,
  getNewsWithLangById,
  updateNewsWithLangById,
  deleteNewsWithLang,
};
