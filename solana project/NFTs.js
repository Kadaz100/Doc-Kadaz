const nftItems = document.querySelectorAll('.nft-item');
const selectedCount = document.getElementById('selectedCount');
const gasFee = document.getElementById('gasFee');
const totalCost = document.getElementById('totalCost');
const mintNow = document.getElementById('mintNow');

let selectedNFTs = [];
const maxSelection = 3;
const gasPerNFT = 0.01; // Example SOL fee per NFT

nftItems.forEach(item => {
  item.addEventListener('click', () => {
    const index = selectedNFTs.indexOf(item);
    if (index > -1) {
      selectedNFTs.splice(index, 1);
      item.classList.remove('selected');
    } else if (selectedNFTs.length < maxSelection) {
      selectedNFTs.push(item);
      item.classList.add('selected');
    }

    // Update UI
    selectedCount.value = selectedNFTs.length;
    gasFee.value = (selectedNFTs.length * gasPerNFT).toFixed(2);

    let total = 0;
    selectedNFTs.forEach(nft => {
      total += parseFloat(nft.getAttribute('data-price'));
    });
    totalCost.value = (total + (selectedNFTs.length * gasPerNFT)).toFixed(2);

    mintNow.disabled = selectedNFTs.length === 0;
  });
});

// Mint Now button action
mintNow.addEventListener('click', () => {
  if (selectedNFTs.length === 0) return;
  alert(`Minting ${selectedNFTs.length} NFTs...`);
  // Your real mint logic will go here
});