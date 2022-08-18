const jwt = require("koa-jwt");
const Router = require("koa-router");
const router = new Router();
const { register, login, me } = require("../controllers/users");
const { secret } = require("../config");

const auth = jwt({ secret });
router.post("/register", register);
router.post("/login", login);
router.get("/me", auth, me);

module.exports = router;
