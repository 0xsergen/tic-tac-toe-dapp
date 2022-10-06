const main = async () => {
  const [owner, playerOne, playerTwo] = await hre.ethers.getSigners();
  const contractFactory = await hre.ethers.getContractFactory("TicTacToe");
  const contract = await contractFactory.deploy(5, 100);
  await contract.deployed();
  console.log("Contract deployed to:", contract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0); // exit Node process without error
  } catch (error) {
    console.log(error);
    process.exit(1); // exit Node process while indicating 'Uncaught Fatal Exception' error
  }
  // Read more about Node exit ('process.exit(num)') status codes here: https://stackoverflow.com/a/47163396/7974948
};

runMain();
