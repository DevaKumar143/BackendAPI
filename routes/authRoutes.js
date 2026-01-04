const express = require("express");
const router = express.Router();
const {body} = require("express-validator");
const {register, login ,googleCallback } = require("../controlller/authController");
const passport = require("passport");
const jwt = require("jsonwebtoken");


router.post("/register", [
     [
    body("name", "Enter Valid Name").isLength({ min: 3 }),
    body("email", "Enter Valid Email").isEmail(),
    body("password", "Enter Password").isLength({ min: 3 }),
  ],
  register
]);


router.post(
  "/login",
  [
    body("email", "Enter Valid Email").isEmail(),
    body("password", "Enter Valid Password").exists(),
  ],
  login
)

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google callback
router.get(
  "/create",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  googleCallback
);

router.get("/github", passport.authenticate("github", {scope: ["user:email"]})
);

router.get(
  "/github/create",
  passport.authenticate("github", { session: false }),
  (req, res) => {
    const token = jwt.sign(
      { user: { id: req.user.id } },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ success: true, token });
  }
);



module.exports = router;

