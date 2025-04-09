const router = require("express").Router();

const langsRouter = require("./langs.routes");
const tagsRouter = require("./tags.routes");
const usersRouter = require("./users.routes");
const categoriesRouter = require("./categories.routes");
const newsRouter = require("./news.routes");
const newsWithLangsRouter = require("./newsWithLangs.routes");
const mediasRouter = require("./medias.routes");
const commentsRouter = require("./comments.routes");
const reportsRouter = require("./reports.routes");
const likesRouter = require("./likes.routes");
const viewsRouter = require("./views.routes");
const notificationsRouter = require("./notifications.routes");
const newsTagsRouter = require("./newsTags.routes");
const authorsRouter = require("./authors.routes");
const otpRouter = require("./otp.routes");

router.use("/langs", langsRouter);
router.use("/tags", tagsRouter);
router.use("/users", usersRouter);
router.use("/categories", categoriesRouter);
router.use("/news", newsRouter);
router.use("/newsWithLangs", newsWithLangsRouter);
router.use("/medias", mediasRouter);
router.use("/comments", commentsRouter);
router.use("/reports", reportsRouter);
router.use("/likes", likesRouter);
router.use("/views", viewsRouter);
router.use("/notifications", notificationsRouter);
router.use("/newsTags", newsTagsRouter);
router.use("/authors", authorsRouter);
router.use("/otp", otpRouter);

module.exports = router;
