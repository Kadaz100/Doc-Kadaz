const text = "Explore the Future of NFTs";
const typingElement = document.getElementById("typing-text");
let i = 0;

function typeWriter() {
  if (i < text.length) {
    typingElement.innerHTML += text.charAt(i);
    i++;
    setTimeout(typeWriter, 80);
  } else {
    // After full sentence, wait 7 seconds, then clear and restart
    setTimeout(() => {
      typingElement.innerHTML = "";
      i = 0;
      typeWriter();
    }, 7000);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  typeWriter();

  // Optional: if you still have your "Get Started" button
  const getStartedBtn = document.getElementById("getStarted");
  if (getStartedBtn) {
    getStartedBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "home.html";
    });
  }
});