function openModal() {
  document.getElementById("walletModal").style.display = "block";
}

function closeModal() {
  document.getElementById("walletModal").style.display = "none";
}

window.onclick = function(event) {
  const modal = document.getElementById("walletModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};


  function toggleWalletModal() {
    const modal = document.getElementById("walletModal");
    modal.style.display = modal.style.display === "block" ? "none" : "block";
  }

  async function connectMetaMask() {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        alert("MetaMask wallet connected!");
        toggleWalletModal();
      } catch (err) {
        alert("Connection failed: " + err.message);
      }
    } else {
      alert("MetaMask not detected");
    }
  }

  async function connectPhantom() {
    if (window.solana && window.solana.isPhantom) {
      try {
        const resp = await window.solana.connect();
        alert("Phantom connected: " + resp.publicKey.toString());
        toggleWalletModal();
      } catch (err) {
        alert("Phantom connection failed: " + err.message);
      }
    } else {
      alert("Phantom Wallet not found.");
    }
  }

  async function connectWithWalletConnect() {
    alert("WalletConnect requires full DApp setup. For now, only MetaMask & Phantom are ready.");
  }

  async function connectMetaMask() {
  console.log("MetaMask button clicked.");
  if (window.ethereum) {
    console.log("Detected window.ethereum");
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      console.log("Accounts:", accounts);
      alert("MetaMask connected: " + accounts[0]);
      toggleWalletModal();
    } catch (err) {
      console.error("MetaMask error:", err);
      alert("Connection failed: " + err.message);
    }
  } else {
    console.warn("MetaMask not detected");
    alert("MetaMask not detected");
  }
}

async function connectPhantom() {
  console.log("Phantom button clicked.");
  const provider = window.solana;
  if (provider && provider.isPhantom) {
    console.log("Detected Phantom");
    try {
      const resp = await provider.connect();
      console.log("Phantom resp:", resp);
      alert("Phantom connected: " + resp.publicKey.toString());
      toggleWalletModal();
    } catch (err) {
      console.error("Phantom error:", err);
      alert("Connection failed: " + err.message);
    }
  } else {
    console.warn("Phantom not found");
    alert("Phantom not found. Please install it.");
  }
}