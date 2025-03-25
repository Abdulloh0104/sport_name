const pool = require("../config/db");
const { errorHandler } = require("../helpers/error_handler");

const addNewLang = async (req, res) => {
  try {
    const { name, code } = req.body;
    const newLang = await pool.query(
      `
            INSERT INTO languages(name,code)
            VALUES ($1,$2) RETURNING *
            `,
      [name, code]
    );
    console.log(newLang);
    console.log(newLang.rows[0]);
    res
      .status(201)
      .send({ messagge: "Yangi til qo'shildi", lang: newLang.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllLangs = async (req, res) => {
  try {
    const { name, code } = req.body;
    const langs = await pool.query(
      `
            select * from languages
            `
    );
    console.log(langs);
    // console.log(langs.rows[0]);
    res
      .status(200)
      .send({ messagge: "Tillar", langs:langs.rows });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getLangById = async (req, res) => {
  try {
    const id = req.params.id;
    const lang = await pool.query(`SELECT * FROM languages where id=${id}`);
    res.send(lang.rows[0]);
  } catch (error) {
    console.log(error);
    res.send("Malumot olishda xatolik");
  }
};
const updateLangById = async (req, res) => {
  const { name, code } = req.body;
  const id = req.params.id;
  await pool.query(`UPDATE languages set name=$1,code=$2 where id=${id}`, [
    name,
    code,
  ]);
  const lang = await pool.query(`SELECT * FROM languages where id=${id}`);

  res.status(200).send({
    message: "Ma'lumotlar muvaffaqqiyatli yangilandi",
    lang: lang.rows[0],
  });
};
const deleteLangById = async (req, res) => {
  const id = req.params.id;
  const lang = await pool.query(`SELECT * FROM languages where id=${id}`);
  await pool.query(`DELETE FROM languages where id=${id}`);
  res
    .status(200)
    .send({ message: "Ma'lumotlar muvaffaqqiyatli o'chirildi", lang:lang.rows[0] });
};

module.exports = {
  addNewLang,
  getAllLangs,
  getLangById,
  updateLangById,
  deleteLangById,
};
