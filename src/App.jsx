import React, { useState } from "react";
import { ethers } from "ethers";
import abi from "./abi.json";

const contractABI = abi;

const ContractInterface = () => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>("");

  const contractAddress = "YOUR_CONTRACT_ADDRESS";

  // Connect to MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      await web3Provider.send("eth_requestAccounts", []);
      const signer = web3Provider.getSigner();
      const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);

      setProvider(web3Provider);
      setContract(contractInstance);

      alert("Wallet connected!");
    } else {
      alert("Please install MetaMask!");
    }
  };

  // Get Contract Balance
  const getBalance = async () => {
    if (contract) {
      const balance = await contract.getBalance();
      setBalance(ethers.utils.formatEther(balance));
    } else {
      alert("Connect your wallet first!");
    }
  };

  // Deposit funds
  const deposit = async () => {
    if (contract) {
      const tx = await contract.deposit({
        value: ethers.utils.parseEther(inputValue),
      });
      await tx.wait();
      alert("Deposit successful!");
      setInputValue("");
      getBalance(); // Refresh balance
    } else {
      alert("Connect your wallet first!");
    }
  };

  // Withdraw funds
  const withdraw = async () => {
    if (contract) {
      const tx = await contract.withdraw(ethers.utils.parseEther(inputValue));
      await tx.wait();
      alert("Withdrawal successful!");
      setInputValue("");
      getBalance(); // Refresh balance
    } else {
      alert("Connect your wallet first!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">Smart Contract Interface</h1>
      {!provider ? (
        <button
          onClick={connectWallet}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Connect Wallet
        </button>
      ) : (
        <>
          <div className="w-full max-w-md space-y-4">
            <div>
              <button
                onClick={getBalance}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
              >
                Get Contract Balance
              </button>
              {balance && (
                <p className="text-center mt-2">
                  Contract Balance: <strong>{balance} ETH</strong>
                </p>
              )}
            </div>

            <div>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter amount in ETH"
                className="w-full px-4 py-2 border rounded mb-2"
              />
              <div className="flex space-x-2">
                <button
                  onClick={deposit}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
                >
                  Deposit
                </button>
                <button
                  onClick={withdraw}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full"
                >
                  Withdraw
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ContractInterface;
