chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (request.method == "getImages") {
    sendResponse({data: getImages()});
  } else {
    sendResponse({});
  }
});

const getImages = () => {
  return (new Array(window.localStorage.length)).fill(0).map((_, i) => {
    const key = window.localStorage.key(i)
    return { name: key, url: window.localStorage.getItem(key) }
  });
}
