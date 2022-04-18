const main = async () => {
    const gameContractFactory = await hre.ethers.getContractFactory('MyEpicGame');
    const gameContract = await gameContractFactory.deploy(                     
      ["Ajit", "Girish", "Shubham"],       // Names
      ["QmZceoVbvtykhadpuRTdvdgx2Kq8E5cH4ECjS21nHm3t8N", // Images
      "QmZLi3ES3Kp5fSSi2Jqz17LMCKYZRj6e3EgE9GhAD91uj1", 
      "QmVVdDYLWxFhENDKePsrAi8SC74uy9wUhbp5XHoLPAbFjH"],
      [100, 200, 150],                    // HP values
      [70, 50, 25],
      "Professor",
      "QmQxedwFqrFJKoKy7gkQrpHvBkFmqPfVFjNwDP28wVt7yL" ,
      1000,
      50,
      );
  
    await gameContract.deployed();
    console.log("Contract deployed to:", gameContract.address);
    console.log("Done deploying!");
  
  };
  
  




  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  
  runMain();