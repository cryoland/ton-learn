
import { TonClient } from '@ton/ton';
import { Address } from '@ton/core';
import { TupleBuilder } from '@ton/ton';

export const client = new TonClient({
    endpoint: 'https://toncenter.com/api/v2/jsonRPC'
});

export const nftCollectionAddress = Address.parse('EQAv9X13hopdcDCO3azadyHy3mqIjzPgr0_fdrUdXjtpZjqP');

// get NFT address by index
(async () => {
    const args = new TupleBuilder();
    args.writeNumber(2);

    const { stack } = await client.runMethod(
        nftCollectionAddress,
        'get_nft_address_by_index',
        args.build(),
    );
    const nftAddress = stack.readAddress();

    console.log('nftAddress', nftAddress.toString());

    setTimeout(async () => { // prevent 429 err
        const stack2 = await client.runMethod(
            nftAddress,
            'get_nft_data'
        );
        stack2.stack.readBigNumber();
        stack2.stack.readBigNumber();
        stack2.stack.readAddress();
        const ownerAddr = stack2.stack.readAddress();
        console.log('owner', ownerAddr);
    }, 2000);

})().catch(e => console.error(e));

/* output:
nftAddress EQCv2VDHfXId4XSEU71zGSMF4zLRuss1eOKEiKn9GYJz2K7s
owner EQDw6S1UiNMJVX3HH2NAv4VMT2KQZA42gtoNnCtLxq32NGNw
*/