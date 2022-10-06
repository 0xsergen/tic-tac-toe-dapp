
# Tic Tac Toe dApp

This decentralized app allows to user create/join and play Tic Tac Toe game. This project is built for _Patika - Akbank Web3 Practicum's Final Project_.
- Game is built to run with smart contract which runs on Avalanche Fuji Testnet.
- Frontend is built to ease interact with smart contracts.
- To try app, click [here](https://patika-akbank-web3-final-case.vercel.app/).
- If needed some test AVAX on Fuji Testnet, click [here](https://faucet.avax.network/) for Official Avalanche Faucet. 
- See [Usage and Screenshots](#usage-and-screenshots) for details.

**Rules**
- Player who create a game is defined as Player 1.
- Game starts by Player 1.
- Reward pool is determined by player who create a game. $(Reward Pool = 2 * entry fee)$
- Winner gets all reward pool excluding commission.
- If there is no winner (in case of draw) each player get their entry fee back. No commission for draw.
- If anyone doesn't join an existing game for 1 day at least, creator of that game (Player 1) will be able to cancel that game and get their entry fee back.



## Run Locally
To get started with this project, clone this repo and follow these commands:


Clone the project

```bash
  git clone https://github.com/sergio2098/patika-akbank-web3-final-case.git
```

Go to the frontend directory of project

```bash
  cd patika-akbank-web3-final-case/frontend
```

Install dependencies

```bash
  npm install
```

Build the application

```bash
  npm run build
```

Start the server

```bash
  npm run start
```

Go to your [localhost](http://localhost:3000/) to check page.



## Usage and Screenshots
<br>Connect your wallet and select Avalanche Fuji Testnet as network</br>
<img width="400" alt="connectWallet" src="https://user-images.githubusercontent.com/89118980/194260338-f2993931-7e31-4fee-b89e-8b611ca2a9f8.png">

<br>Join existing game or Create a new game</br>
<br><img width="400" alt="joinGame" src="https://user-images.githubusercontent.com/89118980/194260491-d15d531a-69a0-4ff9-86a5-cd251d5c8b2f.png"></br>
<br><img width="400" alt="newGame" src="https://user-images.githubusercontent.com/89118980/194260685-fa52d567-f997-4ee9-a2aa-abd637d23f01.png"></br>

<br>Play with your rival</br>
<img width="400" alt="gameDetails" src="https://user-images.githubusercontent.com/89118980/194260520-dfec3eda-4e93-4cb1-a988-08658b6baa8b.png">

<br>Win the game 😎</br>
<img width="400" alt="winGame" src="https://user-images.githubusercontent.com/89118980/194260722-890853db-4ae8-46d7-99ef-dd3ba4340b78.png">

<br>Claim rewards </br>
<img width="400" alt="claimRewards" src="https://user-images.githubusercontent.com/89118980/194260748-8b440d38-f5d3-4cf1-886d-438564d49808.png">


## **Contact?**
[![twitter](https://img.shields.io/badge/twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/sergio_2098)
[![telegram](https://img.shields.io/badge/telegram-229ED9?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/sergio_2098)
[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://sergio2098.showwcase.com/)
