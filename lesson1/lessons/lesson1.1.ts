import { internal } from "ton-core";
import { Container } from "../factory";

export default async function lesson1_1(container: Container) : Promise<void> {
    return new Promise<void> ((resolve) => {
        (async () => {

            const walletContract = container.client.open(container.wallet);
            const seqno = await walletContract.getSeqno();

            await walletContract.sendTransfer({
                secretKey: container.secret,
                seqno: seqno,
                messages: [
                    internal({
                        to: "EQA4V9tF4lY2S_J-sEQR7aUj9IwW-Ou2vJQlCn--2DLOLR5e",
                        value: "0.05",
                        body: "Hello",
                        bounce: false
                    })
                ]
            });

            let currentSeqno = seqno;
            while(currentSeqno==seqno) {
                console.log("awaiting transaction to be confirmed..");
                await sleep(1500);
                currentSeqno = await walletContract.getSeqno();
            }
            console.log("transaction confirmed");

            resolve();
        })()
    })
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}