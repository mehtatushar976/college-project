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

app.post("/new", async (req, res) => {
  try {
    const addRoom = new Room({
      title: req.body.Title,
      location: req.body.Location,
      price: req.body.Price,
      number: req.body.Number,
      description: req.body.Description,

      // title: "Randi Khana",
      // location: "ACEIT FACULTY HOSTEL ROOM NO -5",
      // price: 50, // Set the price to a number
      // description: "Sohan"
    });

    const added = await addRoom.save();
    res.status(201).render("after");
  } catch (error) {
    res.status(400).send(error);
    // console.log(error)
  }
});

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
