import { address, toNano } from "@ton/core";
import { SumContract } from "../wrappers/SumContract";
import { compile, NetworkProvider } from "@ton/blueprint";
import { ownerAddress_testnet, ownerAddress_mainnet } from "../address.sensitive";
import dotenv from "dotenv"

dotenv.config();

export async function run(provider: NetworkProvider) {
  const addrr = process.env.TESTNET ? ownerAddress_testnet : ownerAddress_mainnet;
  const codeCell = await compile("SumContract");

  const myContract = SumContract.createFromConfig(
    {
      sum: 0, // counter init value
      address: address(addrr)
    },
    codeCell
  );

  const openedContract = provider.open(myContract);

  openedContract.sendDeploy(provider.sender(), toNano("0.05"))

  await provider.waitForDeploy(myContract.address);
}