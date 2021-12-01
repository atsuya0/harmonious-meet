let streamStatus = "image";
const canvas = document.createElement("canvas");
canvas.width = 1920;
canvas.height = 1080;
const canvasCtx = canvas.getContext("2d");

const flipHorizontal = () => {
  canvasCtx.scale(-1, 1);
  canvasCtx.translate(-canvas.width, 0);
}

const initCanvas = () => {
  canvasCtx.fillStyle = "black";
  canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
}

const overwriteGetUserMedia = () => {
  navigator.mediaDevices.orgGetUserMedia = navigator.mediaDevices.getUserMedia;
  navigator.mediaDevices.getUserMedia = (constraints) => {
    return new Promise((resolve, reject) => {
      navigator.mediaDevices.orgGetUserMedia(constraints)
        .then((stream) => {
          if (streamStatus === "image" && constraints.video && constraints?.video?.mandatory?.chromeMediaSource !== "desktop") {
            const videoTracks = stream.getVideoTracks();
            videoTracks.find((_) => {
              stream.removeTrack(videoTracks[0]);
              stream.addTrack(canvas.captureStream(10).getVideoTracks()[0]);
              return true;
            });
          }
          resolve(stream);
        })
        .catch((err) => {
          reject(err);
        })
    });
  }
}
const modifyDom = () => {
  const meetButtons = document.getElementsByClassName("cZG6je")[0];

  const streamStatusElement = document.createElement("select");
  streamStatusElement.add(new Option("画像", "image"));
  streamStatusElement.add(new Option("カメラ", "camera"));
  streamStatusElement.addEventListener("change", (e) => {
    streamStatus = e.target.value;
  });
  meetButtons.insertBefore(streamStatusElement, meetButtons.childNodes[1]);

  const sectionToSendImage = document.createElement("div");
  sectionToSendImage.style.padding = "5px";
  meetButtons.appendChild(sectionToSendImage);

  const images = document.createElement("select");
  Array.from(document.getElementsByClassName("harmonious-meet-image")).forEach((element) => {
    images.add(new Option(element.alt, element.src));
  });
  sectionToSendImage.appendChild(images);

  const duration = document.createElement("select");
  duration.add(new Option("一時的", 0));
  duration.add(new Option("永続的", 1));
  sectionToSendImage.appendChild(duration);

  const sendButton = document.createElement("button");
  sendButton.addEventListener("click", () => {
    sendCenteredImageWithAspectRatioAdjusted(images.value, Number(duration.value));
  });
  sendButton.innerText = "送信";
  sectionToSendImage.appendChild(sendButton);
}

const sendCenteredImageWithAspectRatioAdjusted = (url, duration) => {
  const img = new Image();
  img.addEventListener("load", () => {
    const [w, h] = [img.naturalWidth, img.naturalHeight]
    const imgAspectRatio = w / h;
    let dx, dy, dw, dh
    if (imgAspectRatio >= (canvas.width / canvas.height)) {
      dw = canvas.width;
      dh = canvas.width / imgAspectRatio;
      dx = 0;
      dy = (canvas.height - dh) / 2;
    } else {
      dw = canvas.height * imgAspectRatio;
      dh = canvas.height;
      dx = (canvas.width - dw) / 2;
      dy = 0;
    }
    initCanvas();
    canvasCtx.drawImage(img, 0, 0, w, h, dx, dy, dw, dh);

    if (duration === 0) {
      setTimeout(initCanvas, 2000)
    }
  })
  img.src = url;
}

const main = () => {
  flipHorizontal();
  overwriteGetUserMedia();
  const intervalId = setInterval(() => {
    if (document.getElementsByClassName("cZG6je").length > 0) {
      clearInterval(intervalId);
      modifyDom();
    }
  }, 1000);
}

main();
