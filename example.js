const web3 = new Web3();

const actionFunctions = {
  metamask: ConnectWallet,
  // sendButton: SendFunction,
  // accountbutton: AccountInfo,
  // mintactual: mintNFT,
};

for (const id in actionFunctions) {
  document.getElementById(id).addEventListener("click", async () => {
    if (await checkMetaMaskAvailability()) {
      await actionFunctions[id]();
    }
  });
}

async function checkMetaMaskAvailability() {
  if (window.ethereum) {
    try {
      // Check if ethereum object exists
      await window.ethereum.request({ method: "eth_requestAccounts" });
      window.web3 = new Web3(window.ethereum); // inject provider
      return true;
    } catch (err) {
      console.error("Failed to connect to MetaMask:", err);
    }
  } else {
    console.error("MetaMask not found");
  }
  return false;
}

async function ConnectWallet() {
  check = await checkMetaMaskAvailability();
  if (check) {
    document.getElementById("demo").innerText = "Connected to MetaMask";
    document.getElementById("demo").style.color = "green";
  } else {
    console.error("Failed to connect to MetaMask:", err);
    document.getElementById("demo").innerText = "Failed to connect to MetaMask";
    document.getElementById("demo").style.color = "red";
  }
}

async function AccountInfo() {
  const accounts = await web3.eth.getAccounts();
  const balanceInWei = await web3.eth.getBalance(accounts[0]);
  const demo2 = document.getElementById("demo2");
  demo2.innerHTML = `Account Address: ${
    accounts[0]
  }<br>Balance: ${web3.utils.fromWei(balanceInWei, "ether")} ETH`;
  demo2.style.color = "white";
}

async function SendFunction() {
  const to = document.getElementById("addressinput").value;
  const amount = document.getElementById("amountinput").value;
  if (to && amount) {
    const transaction = {
      from: (await web3.eth.getAccounts())[0],
      to: to,
      value: web3.utils.toWei(amount, "ether"),
    };
    try {
      const result = await web3.eth.sendTransaction(transaction);
      console.log("Transaction result:", result);
      document.getElementById("demo2").innerText =
        "Transaction sent successfully";
      document.getElementById("demo2").style.color = "green";
    } catch (err) {
      console.error("Failed to send transaction:", err);
      document.getElementById("demo2").innerText = "Failed to send transaction";
      document.getElementById("demo2").style.color = "red";
    }
  } else {
    console.error("To and amount are required");
  }
}

async function mintNFT() {
  const contractAddress = "0x2e36d1cedd40969fa27b595925e3d739562c0e48";
  const contractABI = [
    {
      name: "name",
      type: "function",
      stateMutability: "view",
      inputs: [],
      outputs: [{ name: "", type: "string" }],
    },
    {
      name: "symbol",
      type: "function",
      stateMutability: "view",
      inputs: [],
      outputs: [{ name: "", type: "string" }],
    },
    {
      name: "mint",
      type: "function",
      stateMutability: "non-payable",
      inputs: [],
      outputs: [],
    },
  ];
  const contract = new web3.eth.Contract(contractABI, contractAddress);
  try {
    const result = await contract.methods
      .mint()
      .send({ from: (await web3.eth.getAccounts())[0], value: 0 });
    console.log("Minting result:", result);
    document.getElementById("demo3").innerText = "Minting successful";
    document.getElementById("demo3").style.color = "green";
  } catch (err) {
    console.error("Failed to mint:", err);
    document.getElementById("demo3").innerText = "Failed to mint";
    document.getElementById("demo3").style.color = "red";
  }
}
