const closeBtn = document.getElementById("x-icon");
const openBtn = document.getElementById("bar-icon");
const sideBar = document.getElementsByClassName("sidebar");
const overlay = document.querySelector("#overlay");

function closeNav(){
    sideBar[0].style.right = "-100%";
    overlay.classList.remove("open");
      
}
function openNav(){
    sideBar[0].style.right = "0";
    overlay.classList.add("open");
}

overlay.addEventListener("click", closeNav);