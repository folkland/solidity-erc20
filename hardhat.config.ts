import "@nomiclabs/hardhat-waffle"
import "@nomiclabs/hardhat-etherscan"
import {environment} from "./environment/environment";

const PRIVATE_KEY = environment.walletPrivateKey;
const INFURA = environment.infuraKey;
const ETHERSCAN = environment.etherscan;

export default {
  solidity: "0.8.4",
  networks: {
    hardhat: {},
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${INFURA}`,
      accounts: [ `${PRIVATE_KEY}` ]
    }
  },
  etherscan: {
    apiKey: `${ETHERSCAN}`
  }
};
