import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from "@ton/core";


export type SumContractConfig = {
    address: Address;
    sum: number;
};

export function SumContractConfigToCell(config: SumContractConfig): Cell {
    return beginCell()
        .storeAddress(config.address)
        .storeUint(config.sum, 32)
        .endCell();
}

export class SumContract implements Contract {
    constructor(
        readonly address: Address,
        readonly init?: { code: Cell, data: Cell }
    ) { }

    static createFromConfig(config: SumContractConfig, code: Cell, workchain = 0) {
        const data = SumContractConfigToCell(config);
        const init = { code, data };
        const address = contractAddress(workchain, init);

        return new SumContract(address, init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(2, 32).endCell(),
        });
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
            sum: stack.readNumber(),
        };
    }

}