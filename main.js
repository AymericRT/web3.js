const web3 = new Web3(window.ethereum);

// Function to check if MetaMask is available
async function checkMetaMaskAvailability() {
  if (typeof window.ethereum !== "undefined") {
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
    document.getElementById("demo").innerText = "MetaMask not found";
    document.getElementById("demo").style.color = "red";
  }
});

//Function to connect to MetaMask
async function ConnectWallet() {
  try {
    // Request access to MetaMask accounts
    await window.ethereum.request({ method: "eth_requestAccounts" });
    // Update status
    document.getElementById("demo").innerText = "Connected to MetaMask";
    document.getElementById("demo").style.color = "green";
  } catch (err) {
    // Handle error
    console.error("Failed to connect to MetaMask:", err);
    // Update status
    document.getElementById("demo").innerText = "Failed to connect to MetaMask";
    document.getElementById("demo").style.color = "red";
  }
}

document.getElementById("accountbutton").addEventListener("click", async () => {
  const metaMaskAvailable = await checkMetaMaskAvailability();
  if (metaMaskAvailable) {
    await AccountInfo();
  }
});

//Function to call the Account Information
async function AccountInfo() {
  const account = await web3.eth.getAccounts();
  console.log(account);
  const from = account[0];
  console.log("it worked?");
  const balanceInWei = await web3.eth.getBalance(from);
  const balanceInEth = web3.utils.fromWei(balanceInWei, "ether");
  console.log("it worked?");
  console.log(balanceInEth);

  // Display the account information
  document.getElementById("demo2").innerText =
    "Account Address: " + from + "\nBalance: " + balanceInEth + " ETH";
  document.getElementById("demo2").style.color = "white";
}

// Add event listener for Send button
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
    document.getElementById("demo2").innerText =
      "Transaction sent successfully";
    document.getElementById("demo2").style.color = "green";
  } catch (err) {
    // Handle error
    console.error("Failed to send transaction:", err);
    // Update status
    document.getElementById("demo2").innerText = "Failed to send transaction";
    document.getElementById("demo2").style.color = "red";
  }
}

// Contract Details
const contractAddress = "0x2e36d1cedd40969fa27b595925e3d739562c0e48"; // Hardcoded contract address
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

document.getElementById("mintactual").addEventListener("click", async () => {
  const metaMaskAvailable = await checkMetaMaskAvailability();
  if (metaMaskAvailable) {
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
      document.getElementById("demo2").innerText =
        "Token Name: " + _name + "\nToken Symbol: " + _symbol;
      document.getElementById("demo2").style.color = "green";

      // Update status
      document.getElementById("demo3").innerText = "Minting successful";
      document.getElementById("demo3").style.color = "green";
    } catch (err) {
      // Handle error
      console.error("Failed to mint:", err);
      // Update status
      document.getElementById("demo3").innerText = "Failed to mint";
      document.getElementById("demo3").style.color = "red";
    }
  }
});
