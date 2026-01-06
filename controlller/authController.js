const User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const {validationResult} = require("express-validator");




exports.register = 
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ errors: "Please Enter a Unique Email" });
      }

      const salt = bcrypt.genSalt(10);
      const hashpass = bcrypt.hash(req.body.password, salt);

      user = await User.create({
        name: req.body.name,
        email: req.body.email ,
        password: hashpass,
      });

      const data = {
        user: {
          id: user.id,
        },
      };

      const Authtoken = jwt.sign(data, process.env.JWT_SECRET);
      res.json({ Authtoken });
    } catch (error) {
      console.log(error.message);
      res.status(400).send("Internal Server Error");
    }
  }

exports.login =  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).send("Enter correct email");
      }

       if (user.provider !== "local") {
      return res.status(400).send(
        `This account uses ${user.provider} login. Please login with ${user.provider}.`
      );
    }
    
      const comparePass = await bcrypt.compare(password, user.password);
      if (!comparePass) {
        return res.status(400).send("Enter corect password");
      }

      const data = {
        user: {
          id: user.id,
        },
      };

      const Authtoken = jwt.sign(data, process.env.JWT_SECRET);
      res.json({ Authtoken });
    } catch (error) {
      console.log(error.message);
      res.status(400).send("Internal Server Error");
    }
}



exports.googleCallback = (req, res) => {
  const token = jwt.sign(
    { user: { id: req.user.id } },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({
    success: true,
    token
  });
};