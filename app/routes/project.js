const jwt = require("koa-jwt");
const Router = require("koa-router");
const router = new Router();
const {
  addProject,
  getProjectlist,
  changeProject,
  deleteProject,
  getProjectDetail,
} = require("../controllers/project");
const { secret } = require("../config");

const auth = jwt({ secret });
router.post("/projects", auth, addProject);
router.get("/projects", auth, getProjectlist);
router.patch("/projects/:id", auth, changeProject);
router.delete("/projects/:id", auth, deleteProject);
router.get("/projects/:id", auth, getProjectDetail);

module.exports = router;
