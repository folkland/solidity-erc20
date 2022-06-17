import "@nomiclabs/hardhat-waffle"
import "@nomiclabs/hardhat-etherscan"
// import { HardhatUserConfig } from "hardhat/config";
// import "tsconfig-paths/register"

export default {
  solidity: "0.8.4",
  networks: {
    hardhat: {},
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/c22fbfd6c6cd42d797f5c9ab08951a27",
      accounts: [ "4d30a59279f431ec920d7652915f1d35cbfd15bf1925a971852da2f866e1ed90" ]
    }
  },
  etherscan: {
    apiKey: "YQ33G3KF9IE5XG9I9UKTNTFKX35UYSG96S"
  }
};
