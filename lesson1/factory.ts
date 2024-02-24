import { Network, getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient, WalletContractV4 } from "ton"
import { KeyPair, mnemonicToWalletKey } from "ton-crypto";

export class Factory {
    static async Build(mnemonic: string, network: Network) : Promise<Container> {
        return new Promise<Container>((resolve, reject) => {
            (async () => {
                try {
                    const key = await mnemonicToWalletKey(mnemonic.split(" "));                    
                    const wallet = WalletContractV4.create({publicKey: key.publicKey, workchain: 0});
                    const endpoint = await getHttpEndpoint({network: network});
                    const client = new TonClient({endpoint});
                    resolve(new Container(client, wallet, key));
                } catch (err) {
                    reject(err);
                }
            })()
        })
    }
}

export class Container {
    constructor(private _client: TonClient, private _wallet: WalletContractV4, private walletKey: KeyPair) {
    }
    get client() : TonClient {
        return this._client;
    }
    get wallet() : WalletContractV4 {
        return this._wallet;
    }
    get secret() : Buffer {
        return this.walletKey.secretKey;
    }
}