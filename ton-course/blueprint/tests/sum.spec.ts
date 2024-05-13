import { Cell, toNano } from "@ton/core";
import { Blockchain, SandboxContract, TreasuryContract } from "@ton/sandbox";
import { SumContract } from "../wrappers/SumContract";
import "@ton/test-utils";
import { compile } from "@ton/blueprint";

describe("sum.fc contract tests", () => {
    let blockchain: Blockchain;
    let myContract: SandboxContract<SumContract>;
    let initWallet: SandboxContract<TreasuryContract>;
    let ownerWallet: SandboxContract<TreasuryContract>;
    let codeCell: Cell;

    beforeAll(async () => {
        codeCell = await compile("SumContract");
    });

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        initWallet = await blockchain.treasury("initWallet");
        ownerWallet = await blockchain.treasury("ownerWallet");        

        myContract = blockchain.openContract(
            await SumContract.createFromConfig({
                sum: 0,
                address: initWallet.address
            }, codeCell)
        );

    });

    it("should successfully increase sum in contract", async () => {
        const senderWallet = await blockchain.treasury("sender");

        const sentMessageResult = await myContract.sendIncrement(
            senderWallet.getSender(),
            toNano("0.05"),
            5
        );

        expect(sentMessageResult.transactions).toHaveTransaction({
            from: senderWallet.address,
            to: myContract.address,
            success: true,
        });

        const data = await myContract.getData();

        expect(data.recent_sender.toString()).toBe(senderWallet.address.toString());
        expect(data.sum).toEqual(5);
    });
});