!function(){var t={startButton:document.querySelector("[data-start]"),stopButton:document.querySelector("[data-stop]")},n=null;t.stopButton.setAttribute("disabled",!0);var o=function(){return document.body.style.backgroundColor="#".concat(Math.floor(16777215*Math.random()).toString(16).padEnd(6,"0"))},e=function(t){if(!0===t)return o(),void(n=setInterval(o,1e3));!1===t&&clearInterval(n)},r=function(){t.startButton.toggleAttribute("disabled"),t.stopButton.toggleAttribute("disabled")};t.startButton.addEventListener("click",(function(){e(!0),r()})),t.stopButton.addEventListener("click",(function(){e(!1),r()}))}();
//# sourceMappingURL=01-color-switcher.f8013401.js.map
