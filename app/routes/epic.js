const jwt = require("koa-jwt");
const Router = require("koa-router");
const router = new Router();
const { addEpic, getEpiclist, deleteEpic } = require("../controllers/epic");
const { secret } = require("../config");

const auth = jwt({ secret });
router.post("/epics", auth, addEpic);
router.get("/epics", auth, getEpiclist);
router.delete("/epics/:id", auth, deleteEpic);
module.exports = router;
