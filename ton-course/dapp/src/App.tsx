import { FC, useState } from 'react';
import { Card } from 'primereact/card';
import { TonConnectButton } from '@tonconnect/ui-react';
import { useSumContract } from "../hooks/useSumContract";
import { useTonConnect } from "../hooks/useTonConnect";
import { Nullable } from 'primereact/ts-helpers';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';

import './style.css';
import 'primereact/resources/themes/bootstrap4-dark-blue/theme.css';
import "primeflex/primeflex.css";
import 'primeicons/primeicons.css';

export const App: FC = () => {
  const [value, setValue] = useState<Nullable<number | null>>(0);
  const {
    counter_value,
    sendIncrement
  } = useSumContract();

  const { connected } = useTonConnect(); 

  return (
    <div className="surface-section px-4 py-5 md:px-6 lg:px-8">
      <div className="flex align-items-start flex-column lg:justify-content-between lg:flex-column">
        <div className='flex flex-column'>

          <div className="flex justify-content-between align-items-start flex-row">
            <div className="font-medium text-3xl text-900">Test DApp</div>
            <TonConnectButton />
          </div>

          <div className="flex align-items-center text-700 flex-wrap">
            <div className="mr-5 flex align-items-center mt-3">
              <i className="pi pi-users mr-2"></i>
              <span>3320 DAU</span>
            </div>
            <div className="mr-5 flex align-items-center mt-3">
              <i className="pi pi-globe mr-2"></i>
              <span>9402 Sessions</span>
            </div>
            <div className="flex align-items-center mt-3">
              <i className="pi pi-clock mr-2"></i>
              <span>2.32m Avg. Duration</span>
            </div>
          </div>

          <div className="mt-3 lg:mt-5">
            <Card 
              title="Sum smartcontract" 
              subTitle={<>
                <span>Current value: {counter_value ?? <><i className="pi pi-spin pi-spinner" style={{ fontSize: '1rem' }}></i> Loading</>}</span>
              </>}
              footer={<>
                <div className="flex justify-content-between align-items-start flex-row">
                  <InputNumber disabled={!connected || !counter_value} showButtons  value={value} onValueChange={(e) => setValue(e.value)} min={0} max={100} />
                  <Button disabled={!connected || !counter_value} label="Submit" icon="pi pi-check" onClick={() => sendIncrement(value as number)} />
                </div>
              </>}
              className="md:w-25rem">
              <p className="m-0">
                Change sum of counter by typing any number and confirming action
              </p>
            </Card>        
          </div>
        </div>
      </div>
    </div>
  );
};
