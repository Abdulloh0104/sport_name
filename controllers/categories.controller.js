const pool = require("../config/db");
const { errorHandler } = require("../helpers/error_handler");

const addNewCategory = async (req, res) => {
  try {
    const { name, description, parent_id } = req.body;
    const newCategory = await pool.query(
      `INSERT INTO categories (name ,description,parent_id)
        VALUES ($1, $2, $3) RETURNING *
        `,
      [name, description, parent_id]
    );

    res
      .status(201)
      .send({ message: "Yangi category qo'shildi", category: newCategory.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllCategories = async (req, res) => {
  try {
    const results = await pool.query("SELECT * FROM categories");
    res.send(results.rows);
  } catch (error) {
    errorHandler(error, res);
    res.send("Malumot olishda xatolik");
  }
};

const getCategoryById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await pool.query(`SELECT * FROM categories where id=${id}`);
    res.send(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.send("Malumot olishda xatolik");
  }
};

const updateCategoryById = async (req, res) => {
  const { category_name, description } = req.body;
  const id = req.params.id;
  await pool.query(
    `UPDATE categories set name=$1,description=$2, parent_id=$3 where id=${id}`,
    [name, description, parent_id]
  );
  const result = await pool.query(`SELECT * FROM categories where id=${id}`);

  res.status(200).send({
    message: "Malumotlar muvaffaqqiyatli yangilandi",
    category: result.rows[0],
  });
};

const deleteCategory = async (req, res) => {
  const id = req.params.id;
  const result = await pool.query(`SELECT * FROM categories where id=${id}`);
  await pool.query(`DELETE FROM categories where id=${id}`);
  res.status(201).send({
    message: "Malumotlar muvaffaqqiyatli o'chirildi",
    category: result.rows[0],
  });
};

module.exports = {
  addNewCategory,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategory,
};
