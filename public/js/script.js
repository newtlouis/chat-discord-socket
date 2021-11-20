const socket = io();
window.onload = () => {
    document.querySelector("form").addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.querySelector("#name");
        const msg = document.querySelector("#msg");

        socket.emit("chat_message", { name: name.value, msg: msg.value })
    });
    socket.on("chat_message", (msg) => {
        document.querySelector("#messages").innerHTML += `<p>${msg.name} dit ${msg.msg}<p/>`;
        document.querySelector("#msg").value = '';

    })
}