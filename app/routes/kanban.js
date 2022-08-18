const jwt = require("koa-jwt");
const Router = require("koa-router");
const router = new Router();
const {
  addKanban,
  getKanbanlist,
  deleteKanban,
  reorder,
} = require("../controllers/kanban");
const { secret } = require("../config");

const auth = jwt({ secret });
router.post("/kanbans", auth, addKanban);
router.get("/kanbans", auth, getKanbanlist);
router.delete("/kanbans/:id", auth, deleteKanban);
router.post("/kanbans/reorder", auth, reorder);

module.exports = router;
