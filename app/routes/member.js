const jwt = require("koa-jwt");
const Router = require("koa-router");
const router = new Router();
const { addMember, getMemberlist } = require("../controllers/member");
const { secret } = require("../config");

const auth = jwt({ secret });
router.post("/member", auth, addMember);
router.get("/users", auth, getMemberlist);

module.exports = router;
