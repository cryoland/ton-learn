import { useEffect, useState } from "react";
import { SumContract } from "../contracts/SumContract";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { Address, OpenedContract } from "@ton/core";
import { toNano } from "@ton/core";
import { useTonConnect } from "./useTonConnect";

export function useSumContract() {
  const { sender } = useTonConnect();
  const client = useTonClient();
  const [contractData, setContractData] = useState<null | {
    counter_value: number;
    recent_sender: Address;
  }>();

  const sumContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new SumContract(
      Address.parse("EQDG9Q55R-827Uz9Wwi0DpWy7SZg9Ym_bOrVIEeAEUc8rgV0")
    );
    return client.open(contract) as OpenedContract<SumContract>;
  }, [client]);

  useEffect(() => {
    async function getValue() {
      setInterval(async () => {

        if (!sumContract) return;
          setContractData(null);
          const val = await sumContract.getData();
          setContractData({
            counter_value: val.sum,
            recent_sender: val.recent_sender,
        });

      }, 5000);
    }
    getValue();
  }, [sumContract]);

  return {
    contract_address: sumContract?.address.toString(),
    ...contractData,
    sendIncrement: (value: number) => {
      return sumContract?.sendIncrement(sender, toNano(0.05), value);
    },
  };
}