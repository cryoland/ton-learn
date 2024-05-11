import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from "@ton/core";


export type TestContractConfig = {
    address: Address;
    number: number;
};

export function TestContractConfigToCell(config: TestContractConfig): Cell {
    return beginCell()
        .storeAddress(config.address)
        .storeUint(config.number, 32)
        .endCell();
}

export class TestContract implements Contract {
    constructor(
        readonly address: Address,
        readonly init?: { code: Cell, data: Cell }
    ) { }

    static createFromConfig(config: TestContractConfig, code: Cell, workchain = 0) {
        const data = TestContractConfigToCell(config);
        const init = { code, data };
        const address = contractAddress(workchain, init);

        return new TestContract(address, init);
    }

    async sendIncrement(
        provider: ContractProvider,
        sender: Sender,
        value: bigint,
        increment_by: number,
    ) {

        const msg_body = beginCell().storeUint(increment_by, 32).endCell();
        await provider.internal(sender, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: msg_body,
        });
    }

    async getData(provider: ContractProvider) {
        const { stack } = await provider.get("get_sum", []);
        return {
            recent_sender: stack.readAddress(),
            number: stack.readNumber(),
        };
    }

}