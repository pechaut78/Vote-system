//npm install react-hooks-global-state
import { createGlobalState } from 'react-hooks-global-state';

const { setGlobalState, useGlobalState } = createGlobalState({ 
    storageValue: 0, 
    web3: null, 
    accounts: null, 
    contract: null,
    isAdmin:false,
    isConnected:false 
});

export const setStorageValue = (storageValue) => {
  setGlobalState('storageValue', (v) => ({ ...v, storageValue }));
};

export const setWeb3 = (web3) => {
  setGlobalState('web3', (v) => ({ ...v, web3 }));
};
export const setAccounts = (accounts) => {
  setGlobalState('accounts', (v) => ({ ...v, accounts }));
};
export const setContract = (contract) => {
  setGlobalState('contract', (v) => ({ ...v, contract }));
};
export const setIsAdmin = (isAdmin) => {
  setGlobalState('isAdmin', (v) => ({ ...v, isAdmin }));
};
export const setIsConnected = (isConnected) => {
  setGlobalState('isConnected', (v) => ({ ...v, isConnected }));
};

export { useGlobalState };