const fileReader = new FileReader();
const image = document.getElementById("image");
const button = document.getElementById("button");

const addImage = (key) => {
  const img = new Image(300);
  img.src = window.localStorage.getItem(key);
  images.appendChild(img);
  img.addEventListener("click", () => {
    if (window.confirm("削除しますか？")) {
      window.localStorage.removeItem(key);
      img.remove();
    }
  });
}

button.addEventListener("click", () => {
  fileReader.readAsDataURL(image.files[0]);
});

fileReader.addEventListener("load", () => {
  window.localStorage.setItem(image.files[0].name, fileReader.result);
  addImage(image.files[0].name);
});

const images = document.getElementById("images");

for (let i = 0; i < window.localStorage.length; i++) {
  const key = window.localStorage.key(i);
  addImage(key);
}
