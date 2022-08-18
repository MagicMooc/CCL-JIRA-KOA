const jwt = require("koa-jwt");
const Router = require("koa-router");
const router = new Router();
const { addTaskType, getTaskTypelist } = require("../controllers/taskType");
const { secret } = require("../config");

const auth = jwt({ secret });
router.post("/taskTypes", auth, addTaskType);
router.get("/taskTypes", auth, getTaskTypelist);

module.exports = router;
