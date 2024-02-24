import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { FirstContract } from '../wrappers/FirstContract';
import '@ton/test-utils';

describe('FirstContract', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let firstContract: SandboxContract<FirstContract>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        firstContract = blockchain.openContract(await FirstContract.fromInit(240220241840n));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await firstContract.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: firstContract.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and firstContract are ready to use
    });

    it('should increment', async () => {
        const counterBefore = await firstContract.getCounter();        
        console.log(`counter before: ${counterBefore}`);
        await firstContract.send(
            deployer.getSender(),
            {
                value: toNano("0.02")
            },
            "increment"
        )
        const counterAfter = await firstContract.getCounter();
        console.log(`counter after: ${counterAfter}`);
        expect(counterBefore).toBeLessThan(counterAfter);
    })

    it('should increment with specified amount', async () => {
        const counterBefore = await firstContract.getCounter();
        console.log(`counter before: ${counterBefore}`);
        const amount = 5n;
        await firstContract.send(
            deployer.getSender(),
            {
                value: toNano("0.02")
            },
            {
                $$type: "Add",
                amount: amount
            }
        )
        const counterAfter = await firstContract.getCounter();
        console.log(`counter after: ${counterAfter}`);
        expect(counterBefore).toBeLessThan(counterAfter);
    })
});
