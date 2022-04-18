const CONTRACT_ADDRESS = '0x2bF44E05b900A34C7771BD65015Ee998BA935a2c';



const  transformCharacterData = (characterData) => {
  return {
  name:   characterData.name,
  imageURI: characterData.imageURI,
  hp: characterData.hp.toNumber(),
  maxhp: characterData.hp.toNumber(),
  attackDamage: characterData.attackDamage.toNumber(),  
   };
};
export {CONTRACT_ADDRESS, transformCharacterData};