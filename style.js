const nav = document.querySelector("#navbar");
let prevScrollY = window.scrollY;

window.addEventListener("scroll", () => {
  if (prevScrollY < window.scrollY) {
    nav.classList.add("nav--hidden");
  } else {
    nav.classList.remove("nav--hidden");
  }
  prevScrollY = window.scrollY;
});