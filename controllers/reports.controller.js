const pool = require("../config/db");
const { errorHandler } = require("../helpers/error_handler");

const addNewReport = async (req, res) => {
  try {
    const { user_id, news_id, reason, status, created_at } = req.body;
    const newReport = await pool.query(
      `INSERT INTO reports (user_id,
      news_id,
      reason,
      status,
      created_at)
        VALUES ($1, $2,$3,$4,$5) RETURNING *
        `,
      [user_id, news_id, reason, status, created_at]
    );

    res
      .status(201)
      .send({ message: "Yangi report qo'shildi", report: newReport.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllReports = async (req, res) => {
  try {
    const results = await pool.query("SELECT * FROM reports");
    res.send(results.rows);
  } catch (error) {
    errorHandler(error, res);
    res.send("Malumot olishda xatolik");
  }
};

const getReportById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await pool.query(`SELECT * FROM reports where id=${id}`);
    res.send(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.send("Malumot olishda xatolik");
  }
};

const updateReportById = async (req, res) => {
  const { user_id, news_id, reason, status, created_at } = req.body;
  const id = req.params.id;
  await pool.query(
    `UPDATE reports set user_id=$1,
      news_id=$2,
      reason=$3,
      status=$4,
      created_at=$5 where id=${id}`,
    [user_id, news_id, reason, status, created_at]
  );
  const result = await pool.query(`SELECT * FROM reports where id=${id}`);

  res.status(200).send({
    message: "Malumotlar muvaffaqqiyatli yangilandi",
    report: result.rows[0],
  });
};

const deleteReport = async (req, res) => {
  const id = req.params.id;
  const result = await pool.query(`SELECT * FROM reports where id=${id}`);
  await pool.query(`DELETE FROM reports where id=${id}`); // RETURNING * tekshirib ko'rishim kerak
  res.status(201).send({
    message: "Malumotlar muvaffaqqiyatli o'chirildi",
    report: result.rows[0],
  });
};

module.exports = {
  addNewReport,
  getAllReports,
  getReportById,
  updateReportById,
  deleteReport,
};
