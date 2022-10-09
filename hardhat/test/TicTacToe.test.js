const { assert, expect } = require("chai");
const { network, deployments, ethers } = require("hardhat");
const { BigNumber, utils } = require("ethers");
// const {
//   developmentChains,
//   networkConfig,
// } = require("../../helper-hardhat-config");

describe("TicTacToe Tests", function () {
  let contractFactory, contract;

  beforeEach(async () => {
    accounts = await ethers.getSigners(); // could also do with getNamedAccounts
    // console.log(accounts);
    deployer = accounts[0];
    player1 = accounts[1];
    player2 = accounts[2];
    // console.log(deployer.address, player1.address, player2.address);

    contractFactory = await ethers.getContractFactory("TicTacToe"); // Returns a new connection to the contract
    contract = await contractFactory.deploy(5, 100);
    contractPlayer1 = contract.connect(player1); // Returns a new instance of the contract connected to player
    contractPlayer2 = contract.connect(player2); // Returns a new instance of the contract connected to player
  });

  it("create a game, join that game with different account", async () => {
    // Ideally, we'd separate these out so that only 1 assert per "it" block
    // And ideally, we'd make this check everything
    await contractPlayer1.startGame({ value: ethers.utils.parseEther("0.1") });
    await contractPlayer2.joinGame(1, {
      value: ethers.utils.parseEther("0.1"),
    });
    const game = await contract.games(1);
    assert.equal(game.isStarted, true);
  });

  it("play the game until P1 wins by row.", async () => {
    await contractPlayer1.startGame({ value: ethers.utils.parseEther("0.1") });
    await contractPlayer2.joinGame(1, {
      value: ethers.utils.parseEther("0.1"),
    });
    await contractPlayer1.makeMove(0, 0, 1);
    await contractPlayer2.makeMove(1, 1, 1);
    await contractPlayer1.makeMove(0, 1, 1);
    await contractPlayer2.makeMove(1, 2, 1);
    await contractPlayer1.makeMove(0, 2, 1);
    const game = await contract.games(1);
    const gameBoard = await contract.getGameBoard(1);
    // console.log(game);
    // console.log(gameBoard[0]);
    // console.log(gameBoard[1]);
    // console.log(gameBoard[2]);
    assert.equal(game.winner, 1);
  });

  it("play the game until P1 wins by column.", async () => {
    await contractPlayer1.startGame({ value: ethers.utils.parseEther("0.1") });
    await contractPlayer2.joinGame(1, {
      value: ethers.utils.parseEther("0.1"),
    });
    await contractPlayer1.makeMove(0, 0, 1);
    await contractPlayer2.makeMove(1, 1, 1);
    await contractPlayer1.makeMove(2, 0, 1);
    await contractPlayer2.makeMove(1, 2, 1);
    await contractPlayer1.makeMove(1, 0, 1);
    const game = await contract.games(1);
    const gameBoard = await contract.getGameBoard(1);
    // console.log(gameBoard[0]);
    // console.log(gameBoard[1]);
    // console.log(gameBoard[2]);
    assert.equal(game.winner, 1);
  });

  it("play the game until P1 wins by left to right diagonal.", async () => {
    await contractPlayer1.startGame({ value: ethers.utils.parseEther("0.1") });
    await contractPlayer2.joinGame(1, {
      value: ethers.utils.parseEther("0.1"),
    });
    await contractPlayer1.makeMove(0, 0, 1);
    await contractPlayer2.makeMove(1, 0, 1);
    await contractPlayer1.makeMove(2, 2, 1);
    await contractPlayer2.makeMove(1, 2, 1);
    await contractPlayer1.makeMove(1, 1, 1);
    const game = await contract.games(1);
    const gameBoard = await contract.getGameBoard(1);
    // console.log(gameBoard[0]);
    // console.log(gameBoard[1]);
    // console.log(gameBoard[2]);
    assert.equal(game.winner, 1);
  });

  it("play the game until P1 wins by right to left diagonal.", async () => {
    await contractPlayer1.startGame({ value: ethers.utils.parseEther("0.1") });
    await contractPlayer2.joinGame(1, {
      value: ethers.utils.parseEther("0.1"),
    });
    await contractPlayer1.makeMove(0, 2, 1);
    await contractPlayer2.makeMove(1, 0, 1);
    await contractPlayer1.makeMove(2, 0, 1);
    await contractPlayer2.makeMove(1, 2, 1);
    await contractPlayer1.makeMove(1, 1, 1);
    const game = await contract.games(1);
    const gameBoard = await contract.getGameBoard(1);
    // console.log(gameBoard[0]);
    // console.log(gameBoard[1]);
    // console.log(gameBoard[2]);
    assert.equal(game.winner, 1);
  });

  it("play the game until draw.", async () => {
    await contractPlayer1.startGame({ value: ethers.utils.parseEther("0.1") });
    await contractPlayer2.joinGame(1, {
      value: ethers.utils.parseEther("0.1"),
    });
    await contractPlayer1.makeMove(0, 0, 1);
    await contractPlayer2.makeMove(1, 1, 1);
    await contractPlayer1.makeMove(2, 2, 1);
    await contractPlayer2.makeMove(0, 1, 1);
    await contractPlayer1.makeMove(2, 1, 1);
    await contractPlayer2.makeMove(2, 0, 1);
    await contractPlayer1.makeMove(0, 2, 1);
    await contractPlayer2.makeMove(1, 2, 1);
    await contractPlayer1.makeMove(1, 0, 1);
    let game = await contract.games(1);
    let gameBoard = await contract.getGameBoard(1);
    // console.log(gameBoard[0]);
    // console.log(gameBoard[1]);
    // console.log(gameBoard[2]);
    assert.equal(game.winner, 3);
  });

  it("revert tx due to try playing twice", async () => {
    await contractPlayer1.startGame({ value: ethers.utils.parseEther("0.1") });
    await contractPlayer2.joinGame(1, {
      value: ethers.utils.parseEther("0.1"),
    });
    await contractPlayer1.makeMove(0, 0, 1);
    await expect(contractPlayer1.makeMove(1, 1, 1)).to.be.revertedWith(
      "Not your turn!"
    );
    // await expect(contract.call()).to.be.revertedWith("Some revert message");
  });

  it("revert tx due to select cell that is already played", async () => {
    await contractPlayer1.startGame({ value: ethers.utils.parseEther("0.1") });
    await contractPlayer2.joinGame(1, {
      value: ethers.utils.parseEther("0.1"),
    });
    await contractPlayer1.makeMove(0, 0, 1);
    await expect(contractPlayer2.makeMove(0, 0, 1)).to.be.revertedWith(
      "Cell is not empty!"
    );
    // await expect(contract.call()).to.be.revertedWith("Some revert message");
  });

  it("revert tx due to try claiming without any reward", async () => {
    await contractPlayer1.startGame({ value: ethers.utils.parseEther("0.1") });
    await contractPlayer2.joinGame(1, {
      value: ethers.utils.parseEther("0.1"),
    });
    // await contractPlayer1.makeMove(0, 0, 1);
    await expect(
      contractPlayer1.claimRewards(ethers.utils.parseEther("9"))
    ).to.be.revertedWith("Not enough balance.");
    // await expect(contract.call()).to.be.revertedWith("Some revert message");
  });

  it("revert tx due to try withdraw money from contract by normal user", async () => {
    // await contractPlayer1.makeMove(0, 0, 1);
    await expect(
      contractPlayer1.withdraw(ethers.utils.parseEther("9"))
    ).to.be.revertedWith("Not owner.");
    // await expect(contract.call()).to.be.revertedWith("Some revert message");
  });

  it("balances are updated based on game rewards.", async () => {
    await contractPlayer1.startGame({ value: ethers.utils.parseEther("0.1") });
    await contractPlayer2.joinGame(1, {
      value: ethers.utils.parseEther("0.1"),
    });
    await contractPlayer1.makeMove(0, 0, 1);
    await contractPlayer2.makeMove(1, 1, 1);
    await contractPlayer1.makeMove(0, 1, 1);
    await contractPlayer2.makeMove(1, 2, 1);
    await contractPlayer1.makeMove(0, 2, 1);
    const game = await contract.games(1);
    const p1Balance = await contract.balance(game.playerOne);
    const p2Balance = await contract.balance(game.playerTwo);
    const contractBalance = await contract.getBalance();
    const commission = await contract.commission();
    // console.log(balance.toString());
    assert.equal(p1Balance.toString(), ethers.utils.parseEther("0.19"));
    assert.equal(p2Balance.toString(), ethers.utils.parseEther("0"));
    assert.equal(contractBalance.toString(), ethers.utils.parseEther("0.2"));
  });

  it("balances are updated based on game rewards after draw.", async () => {
    await contractPlayer1.startGame({ value: ethers.utils.parseEther("0.1") });
    await contractPlayer2.joinGame(1, {
      value: ethers.utils.parseEther("0.1"),
    });
    await contractPlayer1.makeMove(0, 0, 1);
    await contractPlayer2.makeMove(1, 1, 1);
    await contractPlayer1.makeMove(2, 2, 1);
    await contractPlayer2.makeMove(0, 1, 1);
    await contractPlayer1.makeMove(2, 1, 1);
    await contractPlayer2.makeMove(2, 0, 1);
    await contractPlayer1.makeMove(0, 2, 1);
    await contractPlayer2.makeMove(1, 2, 1);
    await contractPlayer1.makeMove(1, 0, 1);
    const game = await contract.games(1);
    const p1Balance = await contract.balance(game.playerOne);
    const p2Balance = await contract.balance(game.playerTwo);
    const contractBalance = await contract.getBalance();
    const commission = await contract.commission();
    // console.log(balance, commission);
    assert.equal(p1Balance.toString(), ethers.utils.parseEther("0.1"));
    assert.equal(p2Balance.toString(), ethers.utils.parseEther("0.1"));
    assert.equal(contractBalance.toString(), ethers.utils.parseEther("0.2"));
  });

  it("claim rewards by player, withdraw commissions by owner.", async () => {
    await contractPlayer1.startGame({ value: ethers.utils.parseEther("5") });
    await contractPlayer2.joinGame(1, {
      value: ethers.utils.parseEther("5"),
    });
    await contractPlayer1.makeMove(0, 0, 1);
    await contractPlayer2.makeMove(1, 1, 1);
    await contractPlayer1.makeMove(0, 1, 1);
    await contractPlayer2.makeMove(1, 2, 1);
    await contractPlayer1.makeMove(0, 2, 1);
    let game = await contract.games(1);
    const contractBalance = await ethers.provider.getBalance(contract.address);
    const rewardBalance = await contractPlayer1.getEachBalance(player1.address);
    const tx = await contractPlayer1.claimRewards(ethers.utils.parseEther("9"));
    await tx.wait();
    const gasUsed = tx.gasPrice;
    const newContractBalance = await ethers.provider.getBalance(
      contract.address
    );
    const newRewardBalance = await contractPlayer1.getEachBalance(
      player1.address
    );
    // console.log(`
    // Contract balance: ${ethers.utils.formatEther(contractBalance)}
    // Reward balance of P1:  ${ethers.utils.formatEther(rewardBalance)}
    // New contract balance: ${ethers.utils.formatEther(newContractBalance)}
    // New reward balance of P1: ${ethers.utils.formatEther(newRewardBalance)}
    // `);

    let commissionBalance = await contract.getEachBalance(contract.address);
    const txWithdraw = await contract.withdraw(ethers.utils.parseEther("0.3"));
    await txWithdraw.wait();

    assert.equal(
      contractBalance
        .sub(BigNumber.from(ethers.utils.parseEther("9")))
        .toString(),
      newContractBalance.toString()
    );
    assert.equal(
      commissionBalance
        .sub(BigNumber.from(ethers.utils.parseEther("0.3")))
        .toString(),
      ethers.utils.parseEther("0.2")
    );
  });

  it("cancel the game after 24 hours", async () => {
    await contractPlayer1.startGame({ value: ethers.utils.parseEther("5") });
    await network.provider.send("evm_increaseTime", [900000]);
    await network.provider.send("evm_mine");
    // let rewardBalance = await ethers.provider.getBalance(player1.address);
    let games = await contract.games(1);
    await contractPlayer1.cancelGame(1);
    // rewardBalance = await ethers.provider.getBalance(player1.address);
    games = await contract.games(1);
    assert.equal(games.rewardPool.toString(), "0");
  });

  it("pause contract by owner, not others", async () => {
    await contract.toggleContract();
    const booly = await contract.pausedAllGames();
    assert.equal(booly, true);
  });

  it("get games array", async () => {
    await contractPlayer1.startGame({ value: ethers.utils.parseEther("5") });

    const games = await contract.getGames();
    // console.log(games);
  });
});
