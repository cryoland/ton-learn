
import { Factory } from "./factory";
import { LessonsPack } from "./lessons";
import { mnemonic } from "./sensitive";

async function main() {    
    const container = await Factory.Build(mnemonic, "testnet");
    
    if (!await container.client.isContractDeployed(container.wallet.address)) {
        return console.log("wallet is not deployed!");
    }
    console.log("wallet deployed!");

    await LessonsPack[process.argv[2] as keyof typeof LessonsPack](container);
}

main();
