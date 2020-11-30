import "@/scripts/base";
import "@/styles/main.scss";

function test_img() {
  let x = document.getElementById("test_img_container");

  x.onclick = function () {
    x.classList.add("active");
    setTimeout(() => x.classList.remove("active"), 3000);
  };
  x.ondblclick = function () {
    x.classList.add("doubleclick");
  };
}

test_img();
