function popImage(img) {
  img.style.transform = 'scale(1.2)';
  img.style.zIndex = 10;
  setTimeout(() => {
    img.style.transform = 'scale(1)';
    img.style.zIndex = 1;
  }, 300);
}
// NFT image click popup
document.querySelectorAll('.pop-image').forEach((img) => {
  img.addEventListener('click', () => {
    const popup = document.createElement('div');
    popup.classList.add('image-popup');
    popup.innerHTML = <img src="${img.src}" alt="Popup NFT" />;
    document.body.appendChild(popup);

    popup.addEventListener('click', () => {
      popup.remove();
    });

    
  });
});
// Show the modal
function openModal() {
  document.getElementById("walletModal").style.display = "block";
}

// Close the modal
function closeModal() {
  document.getElementById("walletModal").style.display = "none";
}

// Connect to MetaMask
function connectMetaMask() {
  if (window.ethereum) {
    window.ethereum.request({ method: "eth_requestAccounts" })
      .then(accounts => {
        alert("Connected: " + accounts[0]);
        closeModal();
      })
      .catch(error => {
        alert("Connection failed.");
        console.error(error);
      });
  } else {
    alert("MetaMask not detected.");
  }
}

// Phantom wallet (Solana)
function connectPhantom() {
  if (window.solana && window.solana.isPhantom) {
    window.solana.connect()
      .then(() => {
        alert("Connected to Phantom");
        closeModal();
      })
      .catch(err => {
        alert("Phantom connection failed.");
      });
  } else {
    alert("Phantom Wallet not found");
  }
}

// WalletConnect placeholder (for real use, you'd integrate WalletConnect script)
function connectWalletConnect() {
  alert("WalletConnect feature coming soon");
}

// Show modal
function openModal() {
  document.getElementById("walletModal").style.display = "block";
}

// Close modal
function closeModal() {
  document.getElementById("walletModal").style.display = "none";
}

// Optional: Close if clicking outside modal
window.onclick = function(event) {
  const modal = document.getElementById("walletModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};