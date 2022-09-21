const nav = document.querySelector("#navbar");
let prevScrollY = window.scrollY;
let currentSection = 0;

window.onload = function(){
  currentSection = Math.round(scrollY / window.innerHeight)
  document.getElementById("section"+currentSection).classList.add("visible")
  document.getElementById("section"+currentSection).classList.remove("hidden")
}

window.addEventListener("scroll", () => {
  if (prevScrollY < window.scrollY) {
    nav.classList.add("nav--hidden");
  } else {
    nav.classList.remove("nav--hidden");
  }
  prevScrollY = window.scrollY;

  const newSection = Math.round(scrollY / window.innerHeight)
  if(newSection != currentSection)
  {
    document.getElementById("section"+currentSection).classList.add("hidden")
    document.getElementById("section"+currentSection).classList.remove("visible")
    currentSection = newSection
    document.getElementById("section"+currentSection).classList.add("visible")
    document.getElementById("section"+currentSection).classList.remove("hidden")
  }
});
