const jwt = require("koa-jwt");
const Router = require("koa-router");
const router = new Router();
const {
  addTask,
  getTasklist,
  getTaskDetail,
  changeTask,
  deleteTask,
  reorder,
} = require("../controllers/task");
const { secret } = require("../config");

const auth = jwt({ secret });
router.post("/tasks", auth, addTask);
router.get("/tasks", auth, getTasklist);
router.get("/tasks/:id", auth, getTaskDetail);
router.patch("/tasks/:id", auth, changeTask);
router.delete("/tasks/:id", auth, deleteTask);
router.post("/tasks/reorder", auth, reorder);

module.exports = router;
