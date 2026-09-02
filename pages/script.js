const path = window.location.pathname;
const text = document.getElementById("page");

const pagesIndex = path.indexOf("/pages/");

const pagePath = pagesIndex !== -1
    ? path.substring(pagesIndex)
    : "/";

document.title = pagePath + " — Volkrig OS";
text.textContent = pagePath;
