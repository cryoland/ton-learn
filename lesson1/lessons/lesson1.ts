import { fromNano } from "ton-core";
import { Container } from "../factory";

export default async function lesson1(container: Container) : Promise<void> {
    return new Promise<void> ((resolve) => {
        (async () => {
            const balance = fromNano(await container.client.getBalance(container.wallet.address));
            console.log(`balance: ${balance}`);
            resolve();
        })()
    })
}