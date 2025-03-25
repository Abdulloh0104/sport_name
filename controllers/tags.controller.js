const pool = require("../config/db");
const { errorHandler } = require("../helpers/error_handler");

const addNewTag = async (req, res) => {
  try {
    const { tag_name, description } = req.body;
    const newTag = await pool.query(
      `INSERT INTO tags (tag_name ,description)
        VALUES ($1, $2) RETURNING *
        `,
      [tag_name, description]
    );

    res
      .status(201)
      .send({ message: "Yangi til qo'shildi", tag: newTag.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllTags = async (req, res) => {
  try {
    const results = await pool.query("SELECT * FROM tags");
    res.send(results.rows);
  } catch (error) {
    errorHandler(error, res);
    res.send("Malumot olishda xatolik");
  }
};

const getTagById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await pool.query(`SELECT * FROM tags where id=${id}`);
    res.send(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.send("Malumot olishda xatolik");
  }
};

const updateTagById = async (req, res) => {
  const { tag_name, description } = req.body;
  const id = req.params.id;
  await pool.query(
    `UPDATE tags set tag_name=$1,description=$2 where id=${id}`,
    [tag_name, description]
  );
  const result = await pool.query(`SELECT * FROM tags where id=${id}`);

  res.status(200).send({
    message: "Malumotlar muvaffaqqiyatli yangilandi",
    tag: result.rows[0],
  });
};

const deleteTag = async (req, res) => {
  const id = req.params.id;
  const result = await pool.query(`SELECT * FROM tags where id=${id}`);
  await pool.query(`DELETE FROM tags where id=${id}`);
  res
    .status(201)
    .send({
      message: "Malumotlar muvaffaqqiyatli o'chirildi",
      tag: result.rows[0],
    });
};

module.exports = {
  addNewTag,
  getAllTags,
  getTagById,
  updateTagById,
  deleteTag,
};
