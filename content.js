addEventListener("load", () => {
  chrome.runtime.sendMessage({method: "getImages"}, (response) => {
    response.data.forEach((img) => {
      const imgElement = new Image(0, 0);
      imgElement.alt = img["name"];
      imgElement.src = img["url"];
      imgElement.className = "harmonious-meet-image";
      imgElement.style.display = "none";
      document.body.insertBefore(imgElement, document.body.firstChild);
    });
  });

  (async () => {
    const res = await fetch(chrome.runtime.getURL("meet.js"), { method: "GET" });
    const script = document.createElement("script");
    script.textContent = await res.text();
    document.body.insertBefore(script, document.body.firstChild);
  })();
}, false)
