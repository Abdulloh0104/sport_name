const express = require("express");
const config = require("config");
const mainRouter = require("./routes/index.routes");
const PORT = config.get("port") || 3030;
const createTables = require("./config/create-tables");
const cookieParser = require("cookie-parser");
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api", mainRouter);
app.get("/create-tables", async (req, res) => {
  await createTables();
  console.log("Tables were created");
  res.status(200).send("created");
});

async function start() {
  try {
    app.listen(PORT, () => {
      console.log(`Server started at: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

start();

//Exam
//DRUD
//Erroh handling
//refresh,accesstoken - autentifikatsiya

// user
//admin jadval
// .. jadval 
// login,register alohida alohida beriladi

//optional
// view engine,pagination