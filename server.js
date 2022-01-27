const register = require("./controller/register.js");
const signin = require("./controller/signin.js");
const images = require("./controller/images.js");
const profiles = require("./controller/profiles.js");

const express = require("express");
const cors = require("cors");
const knex = require("knex");
const bcrypt = require("bcryptjs");
const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", "Key 061d2deaae914137b3d986bb4eeb8689");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: 5432,
    user: "postgres",
    password: "1003emo100",
    database: "smart-brain",
  },
});

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("its working");
});

//
//     =>?                                    Signin

app.post("/signin", (req, res) => signin.signinHandler(req, res, db, bcrypt));

//
//     =>?                                 register

app.post("/register", (req, res) =>
  register.registerHandler(req, res, db, bcrypt)
);

//
//     =>?                                 profile ID

app.get("/profile/:id", (req, res) => profiles.profileHandler(req, res, db));

//
//     =>?                                 Counting image Clicks

app.put("/image", (req, res) => {
  images.imageHandler(req, res, stub, metadata, db);
});

let port_number = process.env.PORT || 3000;
app.listen(port_number);

// let port = process.env.PORT || 8080;
// app.listen("3000", () => {
//   console.log("app is runnig and ready to use");
// });
