// hamburguer menu function
document.querySelector(".hamburguer-menu").addEventListener("click", event => {
  console.log("works");
  const sidebar = document.querySelector(".side-bar");
  document.querySelector(".hamburguer-menu").classList.toggle("change");
  sidebar.classList.toggle("change");
});

window.addEventListener("click", event => {
  console.log(event);
});
