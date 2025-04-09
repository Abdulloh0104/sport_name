const pool = require("./db");

const tables = [
  // `CREATE TABLE IF NOT EXISTS languages (
  //       id SERIAL PRIMARY KEY,
  //       name VARCHAR(50) NOT NULL, 
  //       code VARCHAR(10)
  //   );`,
  // `CREATE TABLE IF NOT EXISTS tags (
  //       id SERIAL PRIMARY KEY,
  //       tag_name VARCHAR(50) NOT NULL, 
  //       description VARCHAR(255)
  //   );`,
  // `CREATE TABLE IF NOT EXISTS authors (
  //       id SERIAL PRIMARY KEY,
  //       user_id INT, 
  //       is_approved BOOLEAN,
  //       is_editor BOOLEAN
  //   );`,
  // `CREATE TABLE IF NOT EXISTS categories (
  //       id SERIAL PRIMARY KEY,
  //       name VARCHAR(50) NOT NULL, 
  //       description VARCHAR(255),
  //       parent_id INT
  //   );`,
  // `CREATE TABLE IF NOT EXISTS comments (
  //       id SERIAL PRIMARY KEY,
  //       user_id INT,
  //       news_id INT,
  //       content VARCHAR(50),
  //       created_at DATE,
  //       reply_comment_id INT, 
  //       is_approved BOOLEAN, 
  //       is_deleted BOOLEAN,
  //       views INT,
  //       likes INT
  //   );`,
  `CREATE TABLE IF NOT EXISTS likes (
        id SERIAL PRIMARY KEY,
        news_id INT,
        user_id INT,
        liked_at DATE,
    );`,
  `CREATE TABLE IF NOT EXISTS medias (
        id SERIAL PRIMARY KEY,
        news_id INT,
        media_type VARCHAR(105),
        media_url VARCHAR(105),
        liked_at DATE,
    );`,
  `CREATE TABLE IF NOT EXISTS news (
        id SERIAL PRIMARY KEY,
        news_id INT,
        category_id INT,
        author_id INT,
        status VARCHAR(105),
        published_at DATE,
        source VARCHAR(105),
    );`,
  // `CREATE TABLE IF NOT EXISTS news_tags (
  //       id SERIAL PRIMARY KEY,
  //       news_id INT,
  //       tag_id INT,
  //   );`,
  // `CREATE TABLE IF NOT EXISTS news_with_langs (
  //       id SERIAL PRIMARY KEY,
  //       title VARCHAR(200) NOT NULL,
  //       content TEXT,
  //       summary_news VARCHAR(255),
  //       lang_id INT
  //   );`,
  // `CREATE TABLE IF NOT EXISTS notifications (
  //       id SERIAL PRIMARY KEY,
  //       user_id INT,
  //       news_id INT,
  //       msg_type VARCHAR(105) (msg_type in (news,reply_comment,like),
  //       is_checked BOOLEAN,
  //       created_at DATE,
  //   );`,
  // `CREATE TABLE IF NOT EXISTS reports (
  //       id SERIAL PRIMARY KEY,
  //       user_id INT,
  //       news_id INT,
  //       reason VARCHAR(105),
  //       status VARCHAR(105) (status in (pending,reviewed,resolved),
  //       created_at DATE,
  //   );`,
  // `CREATE TABLE IF NOT EXISTS users (
  //       id SERIAL PRIMARY KEY,
  //       first_name VARCHAR(50),
  //       last_name VARCHAR(50),
  //       email VARCHAR(50) UNIQUE,
  //       password VARCHAR(50),
  //       role VARCHAR(105) (role in (superadmin,admin,user),
  //       is_active BOOLEAN, 
  //       created_at DATE,
  //       interests INT,
  //       bookmarks INT
  //   );`,
  // `CREATE TABLE IF NOT EXISTS views (
  //       id SERIAL PRIMARY KEY,
  //       news_id INT,
  //       user_id INT,
  //       viewed_at DATE,
  //   );`,
];

module.exports = async () => {
  tables.forEach(async (item) => {
    await pool.query(item);
  });
};
