const express = require("express");
const { dirname } = require("path");
const app = express();

const path = require("path");
app.use(express.static(path.join(__dirname, "public")));


const http = require("http").createServer(app);

const io = require("socket.io")(http);

const Sequelize = require("sequelize");
const dbPath = path.resolve(__dirname, "chat.sqlite");
const sequelize = new Sequelize("database", "username", "password", {
    host: "localhost",
    dialect : "sqlite",
    logging: false,
    storage: dbPath
})

const Chat = require("./Models/Chat")(sequelize, Sequelize.DataTypes);
Chat.sync();

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
})

io.on("connection", (socket) => {
    console.log("Un user s'est connecté");

    socket.on("disconnect", () =>{
        console.log("Un user s'est déconnecté");
    });

    // On écoute les entrées
    socket.on("enter_room", (room)=> {
        socket.join(room);
        console.log(socket.rooms);
    })

    socket.on("chat_message", (msg) => {
        io.emit("chat_message", msg);
    })
})

 http.listen(3000, () => {
     console.log("Port 3000 actif")
 })