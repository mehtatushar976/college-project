const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const hbs = require("hbs");
const mongoose = require("mongoose");
require("./src/db/conn");
const port = process.env.port || 1000;
const path = require("path");
const Register = require("./src/models/registers");
const Room = require("./src/models/room");
const Roomate = require("./src/models/roomate");
const bcrypt = require("bcryptjs");
const fileUpload = require('express-fileupload');
const cloudinary = require("cloudinary").v2;
const multer = require("multer")

// const upload = multer({ dest: "uploads/"});

const storage = multer.diskStorage({
  destination: function(req,file,cb){
    return cb(null, "./uploads");
  },
  filename: function(req,file,cb){
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({storage: storage});


const static_path = path.join(__dirname, "/public");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(static_path));
app.set("view engine", "hbs");

const temp_path = path.join(__dirname, "/template/views");
app.set("views", temp_path);

const partials_path = path.join(__dirname, "/template/partials");
hbs.registerPartials(partials_path);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(fileUpload({
  useTempFiles:true
}))

// cloudinary.config({
//   cloud_name: 'dvvrcwnwa',
//   api_key:'898316241993297',
//   api_secret:'yZaZwlAM5eA4eVxDqww6Nqa84GM'
// })

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/room", (req, res) => {
  res.render("room");
});

app.get("/showRoom", (req, res) => {
  Room.find({})
    .then((x) => {
      res.render("showRoom", { x });
    })
    .catch((e) => {
      console.log(e);
    });
});

app.get("/roomate", (req, res) => {
  res.render("roomate");
});

app.get("/showRoomate", (req, res) => {
  Roomate.find({})
    .then((x) => {
      res.render("showRoomate", { x });
    })
    .catch((e) => {
      console.log(e);
    });
});

app.get("/profile",(req,res)=>{
  res.render("profile")
})

app.get("*", (req, res) => {
  res.send("PAGE NOT FOUND");
});

app.post("/register", async (req, res) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.confirmpassword;

    if (password === cpassword) {
      const registerEmployee = new Register({
        name: req.body.name, 
        email: req.body.email,
        gender: req.body.gender, 
        mobile: req.body.mobile,
        password: req.body.password, 
        confirmpassword: req.body.confirmpassword,
      });

      const registered = await registerEmployee.save();
      res.status(201).render("login");
    } else {
      res.send("PASSWORD ARE NOT MATCHING");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const useremail = await Register.findOne({ email: email });

    const isMatch = await bcrypt.compare(password, useremail.password);

    if (isMatch) {
      res.status(201).render("after");
    } else {
      res.send("INVALID PASSWORD");
    }
  } catch (error) {
    res.status(400).send("INVALID LOGIN DETAILS");
  }
});

app.post("/upload", async (req, res) => {
  try {
    // const file = req.file.image;
    // cloudinary.uploader.upload(file.tempFilePath,(err,result)=>{
      const addRoom = new Room({
        title: req.body.Title,
        location: req.body.Location,
        price: req.body.Price,
        number: req.body.Number,
        description: req.body.Description,
        
    // })
    });

    const added = await addRoom.save();
    res.status(201).render("after");
  } catch (error) {
    res.status(400).send(error);
    // console.log(error)
  }
});


// app.post("/upload", upload.single("image"), async (req, res) => {
//   try {
//       const addRoom = new Room({
//         title: req.body.Title,
//         location: req.body.Location,
//         price: req.body.Price,
//         number: req.body.Number,
//         description: req.body.Description,   
//     });

//     const added = await addRoom.save();
//     res.status(201).render("after");
//   } catch (error) {
//     res.status(400).send(error);
//     // console.log(error)
//   }
// });

app.post("/roomate", async (req, res) => {
  try {
    const newRoomate = new Roomate({
      name: req.body.Name,
      age: req.body.Age,
      gender: req.body.Gender,
      study: req.body.Field,
      number: req.body.Number,
      area: req.body.Area,
    });

    const addedRoomate = await newRoomate.save();

    res.status(201).render("after");
  } catch (error) {
    res.status(201).send(error);
  }
});

app.listen(port, () => {
  console.log("SERVER ON");
});
