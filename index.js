const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
const users = {};
dotenv.config();

app.set("port", process.env.PORT);
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(express.static(path.join(__dirname, "./"))); // html 이외에 css, javascript파일을 불러오기위해서 사용

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./restFront.html"));
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "./about.html"));
});

app.get("/users", (req, res) => {
    res.send(JSON.stringify(users));
});

app.post("/user", (req, res) => {
    console.log("POST 본문(Body):", req.body);
    const user = req.body.name;
    const id = new Date().toISOString();
    users[id] = user;
    res.send("등록 성공");
});

app.put("/user/", (req, res) => {
    console.log("PUT 본문(body):", req.body);
    const key = req.url.split("/")[2];
    users[key] = req.body.name;
    res.send(users);
});

app.delete("/user/", (req, res) => {
    const key = req.body.name;
    delete users[key];
    res.send(users);
});

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, "./404error.html"));
    throw new Error("404");
});

app.use((err, req, res, next) => {
    console.log(" ### Error Detected! ###");
    if (err.message === "404") {
        console.error(err);
        return;
    } else {
        console.error(err);
        return;
    }
});

app.listen(app.get("port"), () => {
    console.log(`server is running at http://localhost:${app.get("port")}`);
});
