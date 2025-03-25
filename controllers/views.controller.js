const pool = require("../config/db");
const { errorHandler } = require("../helpers/error_handler");

const addNewView = async (req, res) => {
  try {
    const { news_id, user_id, viewed_at } = req.body;
    const newView = await pool.query(
      `INSERT INTO views (news_id,
      user_id,
      viewed_at)
        VALUES ($1, $2, $3) RETURNING *
        `,
      [news_id, user_id, viewed_at]
    );

    res
      .status(201)
      .send({ message: "Yangi view qo'shildi", view: newView.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllViews = async (req, res) => {
  try {
    const results = await pool.query("SELECT * FROM views");
    res.send(results.rows);
  } catch (error) {
    errorHandler(error, res);
    res.send("Malumot olishda xatolik");
  }
};

const getViewById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await pool.query(`SELECT * FROM views where id=${id}`);
    res.send(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.send("Malumot olishda xatolik");
  }
};

const updateViewById = async (req, res) => {
  const { news_id, user_id, viewed_at } = req.body;
  const id = req.params.id;
  await pool.query(
    `UPDATE views set news_id=$1,
      user_id=$2,
      viewed_at=$3 where id=${id}`,
    [news_id, user_id, viewed_at]
  );
  const result = await pool.query(`SELECT * FROM views where id=${id}`);

  res.status(200).send({
    message: "Malumotlar muvaffaqqiyatli yangilandi",
    view: result.rows[0],
  });
};

const deleteView = async (req, res) => {
  const id = req.params.id;
  const result = await pool.query(`SELECT * FROM views where id=${id}`);
  await pool.query(`DELETE FROM views where id=${id}`); // RETURNING * tekshirib ko'rishim kerak
  res.status(201).send({
    message: "Malumotlar muvaffaqqiyatli o'chirildi",
    view: result.rows[0],
  });
};

module.exports = {
  addNewView,
  getAllViews,
  getViewById,
  updateViewById,
  deleteView,
};
