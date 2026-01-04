const express = require("express");
const router = express.Router();
const {allNote,createNote, updateNote, deleteNote, SingleNote} = require("../controlller/noteController");

const Auth = require("../middleware/Auth");

router.get("/allnote", allNote );
router.post("/create", Auth, createNote);
router.put("/update/:id", Auth,updateNote );
router.delete("/delete/:id", Auth, deleteNote);
router.get("/note/:id", Auth, SingleNote );

module.exports = router;