const socket = io();

// Arrivée d'un nouvel user
socket.on("connect", () => {
    socket.emit("enter_room", "general");
})

window.onload = () => {
    // Affichage du pseudo
    document.querySelector("#name").value = localStorage.getItem("user_pseudo");

    document.querySelector("form").addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.querySelector("#name");
        const msg = document.querySelector("#msg");
        const room = document.querySelector("#tabs li.active").dataset.room;
        const createdAt = new Date();

        socket.emit("chat_message", {
            name: name.value,
            message: msg.value,
            room: room,
            createdAt: createdAt
        })
    });
    socket.on("chat_message", (msg) => {
        publishMessages(msg);
        document.querySelector("#msg").value = '';
    });

    // on écoute le click sur les onglets
    document.querySelectorAll("#tabs li").forEach((tab) => {
        tab.addEventListener("click", function () {
            if (!this.classList.contains("active")) {
                const actif = document.querySelector("#tabs li.active");
                actif.classList.remove("active");
                this.classList.add("active");
                document.querySelector("#messages").innerHTML = "";

                // On sort puis on entre dans la nouvelle salle
                socket.emit("leave_room", actif.dataset.room);
                socket.emit("enter_room", this.dataset.room);
            }
        })

    });

    socket.on("init_messages", msg => {
        let data = JSON.parse(msg.messages);
        if (data != []) {
            data.forEach(donnees => {
                publishMessages(donnees)
            })
        }
    })

    // On écoute la frappe au clavier
    document.querySelector("#msg").addEventListener("input", () => {
        const name = document.querySelector("#name").value;
        const room = document.querySelector("#tabs li.active").dataset.room;
        socket.emit("typing", {
            name: name,
            room: room
        });
    });

    // On écoute les messages "someone is writting"
    socket.on("usertyping", msg => {
        const writting = document.querySelector("#writting");
        writting.innerHTML = `${msg.name} écrit un message...`;
        setTimeout(function () {
            writting.innerHTML = "";
        }, 5000)
    })
}

function publishMessages(msg) {
    let created = new Date(msg.createdAt);
    let texte = `<div><p><span class="msg__name">${msg.name}</span> <span class="msg__date">${created.toLocaleDateString()}</span></p><p>${msg.message}<p/></div>`;
    document.querySelector("#messages").innerHTML += texte;
}