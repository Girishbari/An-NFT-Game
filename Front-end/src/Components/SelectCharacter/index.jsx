import React, { useEffect, useState } from 'react';
import './SelectCharacter.css'
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, transformCharacterData } from '../../constants';
import myEpicGame from '../../utils/MyEpicGame.json';
import LoadingIndicator from "../../Components/LoadingIndicator";


const SelectCharacter = ({setCharacterNFT}) => {

  const [characters, setCharacters] = useState([]);
  const [gameContract, setGameContract] = useState(null);
  const [mintingCharacter, setMintingCharacter] = useState(false);

    
  useEffect(() => {
  const { ethereum } = window;

  if (ethereum) {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const gameContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      myEpicGame.abi,
      signer
    );

    /*
     * This is the big difference. Set our gameContract in state.
     */
    setGameContract(gameContract);
  } else {
    console.log('Ethereum object not found');
  }
}, []);


    

  useEffect(() => {
  const getCharacters = async () => {
    try {
      console.log('Getting contract characters to mint');
      const charactersTxn = await gameContract.getAllDefaultCharacters();
      console.log('charactersTxn:', charactersTxn);
      const characters = charactersTxn.map((characterData) =>
        transformCharacterData(characterData)
      );

      /*
       * Set all mint-able characters in state
       */
      setCharacters(characters);
    } catch (error) {
      console.error('Something went wrong fetching characters:', error);
    }
  };
  
  const onCharacterMint = async (sender, tokenId, characterIndex) => {
    console.log(
      `CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()}         characterIndex: ${characterIndex.toNumber()}`
  );
      /*
     * Once our character NFT is minted we can fetch the metadata from our contract
     * and set it in state to move onto the Arena
     */
    if (gameContract) {
      const characterNFT = await gameContract.checkIfUserHasNFT();
      console.log('CharacterNFT: ', characterNFT);
      setCharacterNFT(transformCharacterData(characterNFT));
    }
  };
    
  /*
   * If our gameContract is ready, let's get characters!
   */
  if (gameContract) {
    getCharacters();
    gameContract.on('CharacterNFTMinted', onCharacterMint);
 
  }
  return () => {
    /*
     * When your component unmounts, let;s make sure to clean up this listener
     */
    if (gameContract) {
      gameContract.off('CharacterNFTMinted', onCharacterMint);
    }
  };
  
}, [gameContract]);

  




  
  // Render Methods
const renderCharacters = () =>
  characters.map((character, index) => (
    <div className="character-item" key={character.name}>
      <div className="name-container">
        <p>{character.name}</p>
      </div>
      <img src= {`https://cloudflare-ipfs.com/ipfs/${character.imageURI}`}alt={character.name} />
      <button
        type="button"
        className="character-mint-button"
        onClick={()=> mintCharacterNFTAction(index)}
      >{`Mint ${character.name}`}</button>
    </div>
  ));

const mintCharacterNFTAction = async (characterId) => {

  try {
    if (gameContract) {


     setMintingCharacter(true);
      console.log('Minting character in progress...');
      const mintTxn = await gameContract.mintCharacterNFT(characterId);
      await mintTxn.wait();
      console.log('mintTxn:', mintTxn);
      alert(`Your NFT is all done -- see it here: https://testnets.opensea.io/assets/${0x9daA0a13cE3269b076601C1B3e768455f896FB83}/${tokenId.toNumber()}`)

        setMintingCharacter(false);

    }
  } catch (error) {
    console.warn('MintCharacterAction Error:', error);

      setMintingCharacter(false);
  }
};

    
return (
  <div className="select-character-container">
    <h2>Mint Your Hero. Choose wisely.</h2>
    {characters.length > 0 && (
      <div className="character-grid">{renderCharacters()}</div>
    )}

      {mintingCharacter && (
      <div className="loading"> 
          <div className="indicator">
             <LoadingIndicator />
          <p>Minting In Progress...</p>
      </div>
              <img
          src="https://media.giphy.com/media/JnArXDmobfCH287TuQ/giphy.gif"
          alt="Minting loading indicator"
        />
      </div>
      )}   
  </div>
);

};
  

export default SelectCharacter;