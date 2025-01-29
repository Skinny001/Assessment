import { useState } from 'react'
import abi from './abi.json'
import './App.css'
import { ethers } from 'ethers'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  const [balance, setBalance] = useState("0")
  const [depositInput, setDepositInput] = useState(0)
  const [withdrawInput, setWithdrawInput] = useState(0)
  const contractAddress = '0x7F226AA1913daD6F319beDcf619F95d1F1c18A5b'

  async function requestAccounts() {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
  }

  async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccounts()
    }
    const provider = new ethers.BrowserProvider(window.ethereum)
    const contract = new ethers.Contract(contractAddress, abi, provider)

    try {
      const loadingToastId = toast.loading("Retrieving balance...")
      const balance = await contract.getBalance()
      setBalance(balance.toString())
      toast.update(loadingToastId, { render: `Balance Successfully Retrieved: ${balance.toString()}`, type: "success", isLoading: false, autoClose: 5000 })
    } catch(err) {
      toast.error('Transaction failed')
      console.error('Transaction failed', err)
    }
  }

  async function deposit() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccounts()
    }
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const loadingToastId = toast.loading("Processing deposit...")
      const tx = await contract.deposit(depositInput)
      const receipt = await tx.wait()
      setDepositInput(0)
      getBalance()
      toast.update(loadingToastId, { render: 'Deposit Successful', type: "success", isLoading: false, autoClose: 5000 })
    } catch(err) {
      toast.error('Transaction failed')
      console.error('Transaction failed', err)
    }
  }

  async function withdraw() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccounts()
    }
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const loadingToastId = toast.loading("Processing withdrawal...")
      const tx = await contract.withdraw(withdrawInput)
      const receipt = await tx.wait()
      setWithdrawInput(0)
      getBalance()
      toast.update(loadingToastId, { render: 'Withdraw Successful', type: "success", isLoading: false, autoClose: 5000 })
    } catch(err) {
      toast.error('Transaction failed')
      console.error('Transaction failed', err)
    }
  }

  return (
    <>
      <div className="App">
        <h1>0xSkinny001</h1>
        <h2>Balance: {balance}</h2>
        <button onClick={getBalance} style={{ marginTop: '20px',  color: 'blue'}}>Get Your Balance</button>
        <br />
        <input
          type="number"
          value={depositInput}
          placeholder='Deposit amount'
          onChange={(e) => setDepositInput(e.target.value)}
        />
        <button onClick={deposit} style={{ marginTop: '20px' }}>Deposit</button>
        <br />
        <input
          type="number"
          value={withdrawInput}
          placeholder='Withdraw amount'
          onChange={(e) => setWithdrawInput(e.target.value)}
        />
        <button onClick={withdraw} style={{ marginTop: '20px' }}>Withdraw your money</button>
      </div>
      <ToastContainer />
    </>
  )
}

export default App
