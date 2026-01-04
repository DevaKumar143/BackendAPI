const jwt = require("jsonwebtoken");
 const JWT_SECRET="Surah!@fhgh2344"

const Auth = (req, res, next) =>{
    const token = req.header('auth-token');
    if(!token){
        return res.status(401).send({error: "Please Authenticate  Using Valid Token"});
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
         return res.status(401).send({error: "Please Authenticate  Using Valid Token"});
    }
};

module.exports = Auth;