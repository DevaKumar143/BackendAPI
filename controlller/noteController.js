const Note = require("../models/Note");


exports.allNote = async(req, res) =>{
  const AllNote = await Note.find({});
  res.json({AllNote});
}

exports.SingleNote = async(req, res) =>{
  try {
   const note = await Note.findById(req.params.id);

   if(!note){
    return res.status(404).send("Note not found");
   }

   if(note.user.toString() !== req.user.id){
    return res.status(403).send("Not Allowed");
   }

   res.json(note);

  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");;
  }
}

exports.createNote  = async(req, res) =>{
  try {
    const{title, description,location, gender} = req.body;
    let note = new Note({
      title, description, location, gender,
      user : req.user.id
      
    });

    const savedNote = await note.save();
    res.json({savedNote})
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({error: "Server Errors"});
  }
};

exports.updateNote = async(req, res) =>{
  try {
    const {title, description, location, gender} = req.body;
    const newNote = {};

    if(title){
      newNote.title = title;
    }
    if(description){
      newNote.description = description;
    }
    if(location){
      newNote.location = location;
    }
    if(gender){
      newNote.gender = gender;
    }

    let note = await Note.findById(req.params.id);
    if(!note){
      return res.status(400).send("Not Found");
    }
    if(note.user.toString() !== req.user.id){
      return res.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      {$set: newNote},
      {new: true}
    );

    res.json(note);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Internal Server Error");
  }
}

exports.deleteNote =  async(req, res) =>{
  try {
    let note = await Note.findById(req.params.id);
    if(!note){
      return res.status(400).send("Not Found");
    }
    if(note.user.toString() !== req.user.id){
      return res.status(401).send("Not Allowed ")
    }

    note = await Note.findByIdAndDelete(req.params.id);
    res.json({ note, message: "Note has been deleted" });
  } catch (error) {
    console.log(error.message);
    return res.status(404).send("Server Error")
  }
};

