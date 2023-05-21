const web3 = new Web3(window.ethereum);

// Function to check if MetaMask is available
async function checkMetaMaskAvailability() {
  if (window.ethereum) {
    try {
      // Request access to MetaMask accounts
      await window.ethereum.request({ method: "eth_requestAccounts" });
      return true;
    } catch (err) {
      console.error("Failed to connect to MetaMask:", err);
      return false;
    }
  } else {
    console.error("MetaMask not found");
    return false;
  }
}

// Event listener for MetaMask button
document.getElementById("metamask").addEventListener("click", async () => {
  const metaMaskAvailable = await checkMetaMaskAvailability();
  if (metaMaskAvailable) {
    await ConnectWallet();
  } else {
    // MetaMask not available
    console.error("MetaMask not found");
    // Update status
    document.getElementById("status1").innerText = "MetaMask not found";
    document.getElementById("status1").style.color = "red";
  }
});

//Function to connect to MetaMask
async function ConnectWallet() {
  try {
    // Request access to MetaMask accounts
    await window.ethereum.request({ method: "eth_requestAccounts" });
    // Update status
    document.getElementById("status1").innerText = "Connected to MetaMask";
    document.getElementById("status1").style.color = "green";
  } catch (err) {
    // Handle error
    console.error("Failed to connect to MetaMask:", err);
    // Update status
    document.getElementById("status1").innerText = "Failed to connect to MetaMask";
    document.getElementById("status1").style.color = "red";
  }
}

// Event Listener for Account Information
document.getElementById("accountbutton").addEventListener("click", async () => {
  const metaMaskAvailable = await checkMetaMaskAvailability();
  if (metaMaskAvailable) {
    await AccountInformation();
  }
});

//Function to call the Account Information
async function AccountInformation() {
  const account = await web3.eth.getAccounts();
  const from = account[0];
  const balanceInWei = await web3.eth.getBalance(from);
  const balanceInEth = web3.utils.fromWei(balanceInWei, "ether");
  const gasPrice = await web3.eth.getGasPrice();
  const gasPriceInEth = web3.utils.fromWei(gasPrice, "ether");


  // Display the account information
  document.getElementById("status2").innerText =
    "Account Address: " + from + "\nBalance: " + balanceInEth + " ETH" +"\nGas Price: " + gasPriceInEth;
  document.getElementById("status2").style.color = "white";
  
}

// Event Listener for Send Transaction
document.getElementById("sendButton").addEventListener("click", async () => {
  const metaMaskAvailable = await checkMetaMaskAvailability();
  if (metaMaskAvailable) {
    await SendFunction();
  }
});

//Function to call the Send Function
async function SendFunction() {
  // Get input values
  const to = document.getElementById("addressinput").value;
  const amount = document.getElementById("amountinput").value;

  // Check if both to and amount are provided
  if (!to || !amount) {
    console.error("To and amount are required");
    return;
  }

  // Convert amount to wei (1 ether = 10^18 wei)
  const amountWei = web3.utils.toWei(amount, "ether");

  // Get the selected account from MetaMask
  const accounts = await web3.eth.getAccounts();
  const from = accounts[0];

  // Create the transaction object
  const transaction = {
    from: from,
    to: to,
    value: amountWei,
  };

  // Send the transaction
  try {
    const result = await web3.eth.sendTransaction(transaction);
    console.log("Transaction result:", result);
    // Update status
    document.getElementById("status2").innerText =
      "Transaction sent successfully";
    document.getElementById("status2").style.color = "green";
  } catch (err) {
    // Handle error
    console.error("Failed to send transaction:", err);
    // Update status
    document.getElementById("status2").innerText = "Failed to send transaction";
    document.getElementById("status2").style.color = "red";
  }
}

// Event Listener for Mint Button
document.getElementById("mintbutton").addEventListener("click", async () => {
  const metaMaskAvailable = await checkMetaMaskAvailability();
  if (metaMaskAvailable) {
    await mintNFT();
  }
});

// Contract Details
const contractAddress = "0x2e36d1cedd40969fa27b595925e3d739562c0e48"; // Hardcoded contract address
const contractABI = [ // Hardcoded contract ABI
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

// Function to mint NFT and display contract name and symbol
async function mintNFT() {
  const accounts = await web3.eth.getAccounts();
  const from = accounts[0];

  // Instantiate a new Contract
  const contract = new web3.eth.Contract(contractABI, contractAddress);

  // Convert 1 gwei to wei
  // Currently, this variable is unused, but if an NFT requires payment, you can use this as the argument to "value"
  const valueWei = web3.utils.toWei("1", "gwei");

  // Call the mint function
  try {
    const result = await contract.methods
      .mint()
      .send({ from: from, value: 0 });
    const _name = await contract.methods.name().call();
    const _symbol = await contract.methods.symbol().call();
    console.log("Minting result:", result);
    // Update status
    document.getElementById("status2").innerText =
      "Token Name: " + _name + "\nToken Symbol: " + _symbol;
    document.getElementById("status2").style.color = "green";

    // Update status
    document.getElementById("status3").innerText = "Minting successful";
    document.getElementById("status3").style.color = "green";
  } catch (err) {
    // Handle error
    console.error("Failed to mint:", err);
    // Update status
    document.getElementById("status3").innerText = "Failed to mint";
    document.getElementById("status3").style.color = "red";
  }

}