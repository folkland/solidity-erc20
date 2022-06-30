import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

task('balance', 'Check account balance')
    .addParam('account', 'Address for check balance')
    .addParam('token', 'Address of token')
    .setAction(async function (taskArgs: TaskArguments, {ethers}) {
        console.log(taskArgs)
        const contractFactory = await ethers.getContractFactory("Token");
        const contract = contractFactory.attach(taskArgs.token);
        const balance = await contract.balanceOf(taskArgs.account);
        console.log(balance);
    });