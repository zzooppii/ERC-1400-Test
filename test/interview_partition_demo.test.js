const ERC1400 = artifacts.require('ERC1400');
const { expect } = require('chai');

// A simple scenario to demonstrate understanding of ERC-1400 "Partitions"
// We simulate "Class A (Common Shares)" vs "Locked (Restricted Shares)" in STO
contract('ERC-1400 Interview Demo: Tranches / Partitions Management', function ([owner, investor, recipient]) {

    let token;
    const CLASS_A_PARTITION = web3.utils.asciiToHex("CLASS_A");
    const LOCKED_PARTITION = web3.utils.asciiToHex("LOCKED");

    beforeEach(async function () {
        // Deploy ERC1400 token with 18 decimals, owner is the issuer
        token = await ERC1400.new('Hanwha RWA Token', 'HRWA', 1, [owner], [CLASS_A_PARTITION, LOCKED_PARTITION]);
    });

    it('1. Issue different classes of tokens (partitions) to the same investor', async function () {
        // Issue 1000 Class A (Common) tokens
        await token.issueByPartition(CLASS_A_PARTITION, investor, 1000, "0x");

        // Issue 500 Locked (Restricted) tokens
        await token.issueByPartition(LOCKED_PARTITION, investor, 500, "0x");

        // The total balance should be 1500
        const totalBalance = await token.balanceOf(investor);
        expect(totalBalance.toNumber()).to.equal(1500);

        // But they are recorded in different 'drawers' (partitions)
        const classABalance = await token.balanceOfByPartition(CLASS_A_PARTITION, investor);
        expect(classABalance.toNumber()).to.equal(1000);

        const lockedBalance = await token.balanceOfByPartition(LOCKED_PARTITION, investor);
        expect(lockedBalance.toNumber()).to.equal(500);
    });

    it('2. Investors can ONLY transfer their Class A (Common) tokens by specifying the partition', async function () {
        // Initial Issuance
        await token.issueByPartition(CLASS_A_PARTITION, investor, 1000, "0x");
        await token.issueByPartition(LOCKED_PARTITION, investor, 500, "0x");

        // Transfer 100 Class A tokens from Investor to Recipient
        await token.transferByPartition(CLASS_A_PARTITION, recipient, 100, "0x", { from: investor });

        // Validate balances updated
        const remainingClassA = await token.balanceOfByPartition(CLASS_A_PARTITION, investor);
        expect(remainingClassA.toNumber()).to.equal(900);

        const recipientClassA = await token.balanceOfByPartition(CLASS_A_PARTITION, recipient);
        expect(recipientClassA.toNumber()).to.equal(100);
    });

    it('3. Simulating Lock-up Release: Upgrading Locked tokens to Class A tokens', async function () {
        // Issued as Locked Tokens
        await token.issueByPartition(LOCKED_PARTITION, investor, 500, "0x");

        // After 6 months, the system operator decides to release the lock-up
        // They redeem (burn) the locked partition and re-issue into Class A partition

        // 1. Operator redeems the locked tokens
        await token.operatorRedeemByPartition(LOCKED_PARTITION, investor, 500, "0x", "0x", { from: owner });

        // 2. Issuance of standard Class A tokens to replace them
        await token.issueByPartition(CLASS_A_PARTITION, investor, 500, "0x", { from: owner });

        // Validate the conversion
        const lockedBalance = await token.balanceOfByPartition(LOCKED_PARTITION, investor);
        expect(lockedBalance.toNumber()).to.equal(0);

        const classABalance = await token.balanceOfByPartition(CLASS_A_PARTITION, investor);
        expect(classABalance.toNumber()).to.equal(500);
    });
});
