const socket = io();

// Arrivée d'un nouvel user
socket.on("connect", () => {
    socket.emit("enter_room", "general");
})

window.onload = () => {
    document.querySelector("form").addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.querySelector("#name");
        const msg = document.querySelector("#msg");
        const room = document.querySelector("#tabs li.active").dataset.room;
        const createdAt = new Date();

        socket.emit("chat_message", { 
            name: name.value, 
            msg: msg.value,
            room: room,
            createdAt: createdAt
        })
    });
    socket.on("chat_message", (msg) => {
        document.querySelector("#messages").innerHTML += `<p>${msg.name} dit ${msg.msg}<p/>`;
        document.querySelector("#msg").value = '';
    });

    // on écoute le click sur les onglets
    document.querySelectorAll("#tabs li").forEach((tab) => {
        tab.addEventListener("click", function () {
            if (!this.classList.contains("active")) {
                const actif = document.querySelector("#tabs li.active");
                actif.classList.remove("active");
                this.classList.add("active");
                document.querySelector("#messages").innerHTML ="";
                
                // On sort puis on entre dans la nouvelle salle
                socket.emit("leave_room", actif.dataset.room);
                socket.emit("enter_room", this.dataset.room);
            }
        })

    })
}