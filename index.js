const express = require("express");
const app = express();

const http = require("http").createServer(app);

const io = require("socket.io")(http);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
})

io.on("connection", (socket) => {
    console.log("Un user s'est connecté");

    socket.on("disconnect", () =>{
        console.log("Un user s'est déconnecté");
    });

    socket.on("chat_message", (msg) => {
        io.emit("chat_message", msg);
    })
})

 http.listen(3000, () => {
     console.log("Port 3000 actif")
 })