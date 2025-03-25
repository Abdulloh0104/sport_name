const pool = require("../config/db");
const { errorHandler } = require("../helpers/error_handler");

const addNewLike = async (req, res) => {
  try {
    const { news_id, user_id, liked_at } = req.body;
    const newLike = await pool.query(
      `INSERT INTO likes (news_id,
      user_id,
      liked_at)
        VALUES ($1, $2, $3) RETURNING *
        `,
      [news_id, user_id, liked_at]
    );

    res
      .status(201)
      .send({ message: "Yangi like qo'shildi", like: newLike.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllLikes = async (req, res) => {
  try {
    const results = await pool.query("SELECT * FROM likes");
    res.send(results.rows);
  } catch (error) {
    errorHandler(error, res);
    res.send("Malumot olishda xatolik");
  }
};

const getLikeById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await pool.query(`SELECT * FROM likes where id=${id}`);
    res.send(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.send("Malumot olishda xatolik");
  }
};

const updateLikeById = async (req, res) => {
  const { news_id, user_id, liked_at } = req.body;
  const id = req.params.id;
  await pool.query(
    `UPDATE likes set news_id=$1,
      user_id=$2,
      liked_at=$3 where id=${id}`,
    [news_id, user_id, liked_at]
  );
  const result = await pool.query(`SELECT * FROM likes where id=${id}`);

  res.status(200).send({
    message: "Malumotlar muvaffaqqiyatli yangilandi",
    like: result.rows[0],
  });
};

const deleteLike = async (req, res) => {
  const id = req.params.id;
  const result = await pool.query(`SELECT * FROM likes where id=${id}`);
  await pool.query(`DELETE FROM likes where id=${id}`); // RETURNING * tekshirib ko'rishim kerak
  res.status(201).send({
    message: "Malumotlar muvaffaqqiyatli o'chirildi",
    like: result.rows[0],
  });
};

module.exports = {
  addNewLike,
  getAllLikes,
  getLikeById,
  updateLikeById,
  deleteLike,
};
