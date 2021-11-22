window.onload = () => {
    document.querySelector("form").addEventListener("submit", e => {
        e.preventDefault();
        const user_name = document.querySelector(".form__pseudo__value").value;
        localStorage.setItem("user_pseudo", user_name);
        window.location.href = "/";
    })
}