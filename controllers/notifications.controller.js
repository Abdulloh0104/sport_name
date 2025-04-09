const pool = require("../config/db");
const { errorHandler } = require("../helpers/error_handler");

const addNewNotification = async (req, res) => {
  try {
    const { user_id,news_id,msg_type,is_checked, created_at } = req.body;
    const newNotification = await pool.query(
      `INSERT INTO notifications (user_id,news_id,msg_type,is_checked, created_at)
        VALUES ($1, $2, $3, $4, $5) RETURNING *
        `,
      [user_id, news_id, msg_type, is_checked, created_at]
    );

    res
      .status(201)
      .send({ message: "Yangi xabar qo'shildi", notification: newNotification.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllNotifications = async (req, res) => {
  try {
    const results = await pool.query("SELECT * FROM notifications");
    res.send(results.rows);
  } catch (error) {
    errorHandler(error, res);
    res.send("Malumot olishda xatolik");
  }
};

const getNotificationById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await pool.query(`SELECT * FROM notifications where id=${id}`);
    res.send(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.send("Malumot olishda xatolik");
  }
};

const updateNotificationById = async (req, res) => {
  const { user_id, news_id, msg_type, is_checked, created_at } = req.body;
  const id = req.params.id;
  await pool.query(
    `UPDATE notifications set user_id=$1,news_id=$2,msg_type=$3,is_checked=$4, created_at=$5 where id=${id}`,
    [user_id, news_id, msg_type, is_checked, created_at]
  );
  const result = await pool.query(`SELECT * FROM notifications where id=${id}`);

  res.status(200).send({
    message: "Malumotlar muvaffaqqiyatli yangilandi",
    notification: result.rows[0],
  });
};

const deleteNotification = async (req, res) => {
  const id = req.params.id;
  const result = await pool.query(`SELECT * FROM notifications where id=${id}`);
  await pool.query(`DELETE FROM notifications where id=${id}`);
  res
    .status(201)
    .send({
      message: "Malumotlar muvaffaqqiyatli o'chirildi",
      notification: result.rows[0],
    });
};

module.exports = {
  addNewNotification,
  getAllNotifications,
  getNotificationById,
  updateNotificationById,
  deleteNotification,
};
