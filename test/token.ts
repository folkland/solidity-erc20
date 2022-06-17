import { expect } from "chai";
import { ethers } from "hardhat";
import {Contract, ContractFactory, Signer} from "ethers";

describe('ATON contract', function () {
    let token: ContractFactory;
    let hardhatToken: Contract;
    let owner: Signer;
    let addr1: Signer;
    let addr2: Signer;

    beforeEach(async function() {
        [ owner, addr1, addr2 ] = await ethers.getSigners();
        token = await ethers.getContractFactory("Token");
        hardhatToken = await token.deploy(owner.getAddress());
    })

    it('Deployment should assign the total supply of tokens to the owner', async function () {
        const ownerBalance = await hardhatToken.balanceOf(owner.getAddress());
        expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
    });

    describe('Base transfer', function () {
        it('Check good transfer', async function() {
            await hardhatToken.transfer(addr1.getAddress(), 150)
            expect(await hardhatToken.connect(addr1).balanceOf(addr1.getAddress())).to.equal(150);
            await hardhatToken.connect(addr1).transfer(addr2.getAddress(), 40)
            expect(await hardhatToken.connect(addr2).balanceOf(addr2.getAddress())).to.equal(40);
            expect(await hardhatToken.connect(addr1).balanceOf(addr1.getAddress())).to.equal(110);
        });
        it('Fail transfer, amount bigger than balance', async function() {
            await expect(hardhatToken.connect(addr1).transfer(owner.getAddress(), 120)).to.be.revertedWith("Not enough token");
            expect(await hardhatToken.balanceOf(owner.getAddress())).to.equal(await hardhatToken.totalSupply());
        })
    });

    describe('Allowance check', function () {
        it('Fail allowance check', async function () {
            await expect(hardhatToken.allowance(addr1.getAddress(), addr2.getAddress())).to.be.revertedWith('You can\'t see this allowance');
            await hardhatToken.connect(addr2).approve(addr1.getAddress(), 100);
            await expect(hardhatToken.allowance(addr2.getAddress(), addr1.getAddress())).to.be.revertedWith('You can\'t see this allowance');
        });
        it('Approve and allowance success', async function () {
            await hardhatToken.approve(addr1.getAddress(), 100);
            expect(await hardhatToken.allowance(owner.getAddress(), addr1.getAddress())).to.equal(100);
            expect(await hardhatToken.allowance(owner.getAddress(), addr2.getAddress())).to.equal(0);
        });
        it('Approve and transfer from owner', async function () {
            await hardhatToken.approve(addr1.getAddress(), 100);
            hardhatToken.connect(addr1).transferFrom(owner.getAddress(), addr2.getAddress(), 10)
            expect(await hardhatToken.connect(addr2).balanceOf(addr2.getAddress())).to.equal(10);
            expect(await hardhatToken.allowance(owner.getAddress(), addr1.getAddress())).to.equal(90);
            hardhatToken.connect(addr1).transferFrom(owner.getAddress(), addr2.getAddress(), 30)
            expect(await hardhatToken.connect(addr2).balanceOf(addr2.getAddress())).to.equal(40);
            expect(await hardhatToken.allowance(owner.getAddress(), addr1.getAddress())).to.equal(60);
        });
        it('Fail transfers from', async function () {
            await hardhatToken.approve(addr1.getAddress(), 5);
            await expect(hardhatToken.connect(addr1).transferFrom(owner.getAddress(), addr2.getAddress(), 6)).to.be.revertedWith('You don\'t have privilege or amount big');
            expect(await hardhatToken.connect(addr2).balanceOf(addr2.getAddress())).to.equal(0);
            expect(await hardhatToken.allowance(owner.getAddress(), addr1.getAddress())).to.equal(5);
            await expect(hardhatToken.connect(addr2).transferFrom(owner.getAddress(), addr1.getAddress(), 2)).to.be.revertedWith('You don\'t have privilege or amount big');
            await hardhatToken.connect(addr2).approve(addr1.getAddress(), 5);
            await expect(hardhatToken.connect(addr1).transferFrom(addr2.getAddress(), owner.getAddress(), 1)).to.be.revertedWith('Sender don\'t have tokens');
        });
    })
});