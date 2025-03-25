const pool = require("../config/db");
const { errorHandler } = require("../helpers/error_handler");

const addNewComment = async (req, res) => {
  try {
    const {
      user_id,
      news_id,
      content,
      created_at,
      reply_comment_id,
      is_approved,
      is_deleted,
      views,
      likes,
    } = req.body;
    const newComment = await pool.query(
      `INSERT INTO comments (user_id,
      news_id,
      content,
      created_at,
      reply_comment_id,
      is_approved,
      is_deleted,
      views,
      likes)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *
        `,
      [
        user_id,
        news_id,
        content,
        created_at,
        reply_comment_id,
        is_approved,
        is_deleted,
        views,
        likes,
      ]
    );

    res.status(201).send({
      message: "Yangi comment qo'shildi",
      comment: newComment.rows[0],
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllComments = async (req, res) => {
  try {
    const results = await pool.query("SELECT * FROM comments");
    res.send(results.rows);
  } catch (error) {
    errorHandler(error, res);
    res.send("Malumot olishda xatolik");
  }
};

const getCommentById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await pool.query(`SELECT * FROM comments where id=${id}`);
    res.send(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.send("Malumot olishda xatolik");
  }
};

const updateCommentById = async (req, res) => {
  const {
    user_id,
    news_id,
    content,
    created_at,
    reply_comment_id,
    is_approved,
    is_deleted,
    views,
    likes,
  } = req.body;
  const id = req.params.id;
  await pool.query(
    `UPDATE comments set user_id=$1,
      news_id=$2,
      content=$3,
      created_at=$4,
      reply_comment_id=$5,
      is_approved=$6,
      is_deleted=$7,
      views=$8,
      likes=$9 where id=${id}`,
    [
      user_id,
      news_id,
      content,
      created_at,
      reply_comment_id,
      is_approved,
      is_deleted,
      views,
      likes,
    ]
  );
  const result = await pool.query(`SELECT * FROM comments where id=${id}`);

  res.status(200).send({
    message: "Malumotlar muvaffaqqiyatli yangilandi",
    comment: result.rows[0],
  });
};

const deleteComment = async (req, res) => {
  const id = req.params.id;
  const result = await pool.query(`SELECT * FROM comments where id=${id}`);
  await pool.query(`DELETE FROM comments where id=${id}`); // RETURNING * tekshirib ko'rishim kerak
  res.status(201).send({
    message: "Malumotlar muvaffaqqiyatli o'chirildi",
    comment: result.rows[0],
  });
};

module.exports = {
  addNewComment,
  getAllComments,
  getCommentById,
  updateCommentById,
  deleteComment,
};
