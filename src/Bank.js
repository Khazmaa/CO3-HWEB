import {writable} from "svelte/store";

const contractAddress = import.meta.env.VITE_SC_BANK_ADDRESS;

export let bankCO3 = writable(0);

export const getBalanceCO3 = async (tezos, walletAddress) => {
    const contract = await tezos.wallet.at(contractAddress);
    const storage = await contract.storage();
    const balanceMutez = await storage.get(walletAddress);
    bankCO3.set(isNaN(balanceMutez) ? 0 : balanceMutez / 1000000);
};

const transfer = async (tezos, transacParams, walletAddress) => {
    const estimate = await tezos.estimate.transfer(transacParams);
    const operation = await tezos.wallet
        .transfer({
            ...transacParams,
            ...estimate,
        })
        .send();
    console.log(`Waiting for ${operation.opHash} to be confirmed...`);
    await operation.confirmation(2);
    console.log(
        `Operation injected: https://ghost.tzstats.com/${operation.opHash}`
    );
    await getBalanceCO3(tezos, walletAddress);
}

export const deposit = async (tezos, walletHandler, depositAmount, contractAddress) => {
    const contract = await tezos.wallet.at(contractAddress);
    tezos.setWalletProvider(walletHandler);
    const walletAddress = await walletHandler.getPKH();
    const transacParams = await contract.methods
        .deposit()
        .toTransferParams({
            amount: depositAmount,
        });
    await transfer(tezos, transacParams, walletAddress);
};

export const withdraw = async (tezos, walletHandler) => {
    tezos.setWalletProvider(walletHandler);
    const walletAddress = walletHandler.getPKH();
    const contract = await tezos.wallet.at(contractAddress);
    const transacParams = await contract.methods
        .withdraw()
        .toTransferParams();
    const estimate = await tezos.estimate.transfer(transacParams);
    await transfer(tezos, transacParams, walletAddress)
};