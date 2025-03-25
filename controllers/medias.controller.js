const pool = require("../config/db");
const { errorHandler } = require("../helpers/error_handler");

const addNewMedia = async (req, res) => {
  try {
    const { news_id, media_type, media_url, uploaded_at } = req.body;
    const newMedia = await pool.query(
      `INSERT INTO medias (news_id, media_type, media_url, uploaded_at)
        VALUES ($1, $2,$3,$4) RETURNING *
        `,
      [news_id, media_type, media_url, uploaded_at]
    );

    res
      .status(201)
      .send({ message: "Yangi media qo'shildi", media: newMedia.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllMedias = async (req, res) => {
  try {
    const results = await pool.query("SELECT * FROM medias");
    res.send(results.rows);
  } catch (error) {
    errorHandler(error, res);
    res.send("Malumot olishda xatolik");
  }
};

const getMediaById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await pool.query(`SELECT * FROM medias where id=${id}`);
    res.send(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.send("Malumot olishda xatolik");
  }
};

const updateMediaById = async (req, res) => {
  const { news_id, media_type, media_url, uploaded_at } = req.body;
  const id = req.params.id;
  await pool.query(
    `UPDATE medias set news_id=$1, media_type=$2, media_url=$3, uploaded_at=&4 where id=${id}`,
    [news_id, media_type, media_url, uploaded_at]
  );
  const result = await pool.query(`SELECT * FROM medias where id=${id}`);

  res.status(200).send({
    message: "Malumotlar muvaffaqqiyatli yangilandi",
    media: result.rows[0],
  });
};

const deleteMedia = async (req, res) => {
  const id = req.params.id;
  const result = await pool.query(`SELECT * FROM medias where id=${id}`);
  await pool.query(`DELETE FROM medias where id=${id}`); // RETURNING * tekshirib ko'rishim kerak
  res.status(201).send({
    message: "Malumotlar muvaffaqqiyatli o'chirildi",
    media: result.rows[0],
  });
};

module.exports = {
  addNewMedia,
  getAllMedias,
  getMediaById,
  updateMediaById,
  deleteMedia,
};
