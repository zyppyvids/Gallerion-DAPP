# Gallerion DAPP
**Gallerion** is a fully-functional Decentralized Application consisting of Solidity smart contract in the Ethereum blockchain + client-side app (HTML5) and server-side logic (JavaScript). The Gallerion keeps some data and logic in the Ethereum blockchain and provides UI to access it.

## General Requirements
- Smart contracts, implemented in Solidity, deployed in a *local network* ✅
- Client-side app - (HTML5) ✅
- Decentralized Storage - (IPFS) ✅
- Unit tests - (Truffle Tests) ✅
- Server-side logic - (JavaScript) ✅

## Business Logic
- *Guests* can view the *photos and pictures*
  - They don't see their contracts and addresses
- *Guests* can register as *users* and *buy pictures*
  - When a *picture is bought* the payment is send to the smart contract
  - The smart contract retain *10% as commision*
- *Authors* register and list *picures* for *sell* in the Ethereum blockchain
  - Each *picture* consists JSON document + image in IPFS
- *Users* should have a wallet
  - *MetaMask*
  - Transaction signing is in the client-side
  
## Bonus 
- Create token
- People can use ETHs only to buy our token
- Make the token the main currency and accept only it

<p align="center">
<img src="https://tuku.vimsky.com/images/2018/02/80dc7f722a344d6d84556e990ff16018.jpg" alt="Decentralised App">
</p>
