import { Cell, toNano } from "@ton/core";
import { hex } from "../build/test.compiled.json";
import { Blockchain, SandboxContract, TreasuryContract } from "@ton/sandbox";
import { TestContract } from "../wrappers/TestContract";
import "@ton/test-utils";

describe("test_contract", () => {
    let blockchain: Blockchain;
    let myContract: SandboxContract<TestContract>;
    let initWallet: SandboxContract<TreasuryContract>;
    let senderWallet: SandboxContract<TreasuryContract>;
    let codeCell: Cell;

    beforeAll(async () => {
        codeCell = Cell.fromBoc(Buffer.from(hex, "hex"))[0];
    });

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        initWallet = await blockchain.treasury("initWallet");
        senderWallet = await blockchain.treasury("senderWallet");        

        myContract = blockchain.openContract(
            await TestContract.createFromConfig({
                number: 0,
                address: initWallet.address
            }, codeCell)
        );

    });

    it("get_sum test", async () => {
        const myContract = blockchain.openContract(
            await TestContract.createFromConfig({ 
                address: initWallet.address, 
                number: 0 
            }, codeCell)
        );

        const sentMessageResult_1 = await myContract.sendIncrement(senderWallet.getSender(), toNano("0.05"), 10);
        expect(sentMessageResult_1.transactions).toHaveTransaction({
            from: senderWallet.address,
            to: myContract.address,
            success: true,
        });

        const getData_1 = await myContract.getData();
        expect(getData_1.number).toEqual(10);

        const sentMessageResult_2 = await myContract.sendIncrement(senderWallet.getSender(), toNano("0.05"), 20);
        expect(sentMessageResult_2.transactions).toHaveTransaction({
            from: senderWallet.address,
            to: myContract.address,
            success: true,
        });
        const getData_2 = await myContract.getData();
        expect(getData_2.number).toEqual(30);

        expect(getData_2.recent_sender.toString()).toBe(senderWallet.address.toString());
    });

})