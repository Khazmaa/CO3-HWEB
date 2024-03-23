<script>
    import {deposit} from "./Bank.js";

    const bankAddress = import.meta.env.VITE_SC_BANK_ADDRESS;

    export let co2_emit;
    export let user_buy;
    export let walletHandler;
    export let tezos;

    const buy_CO3 = async (amount) => {
        try {
            await deposit(tezos, walletHandler, amount, bankAddress);
            user_buy = true;
        } catch (e) {
            console.error("Error when trying to buy some coin: ", e);
        }

    }
</script>

<div>
    <p>Your wallet has emitted {co2_emit} grams of CO2.</p>
    <p>You can refund your impact by buying some CO3 that will be used to support so environmental organization.</p>
    <p> How much do you want to refund ?</p>
    <button on:click={() => buy_CO3(co2_emit)}>100%</button>
    <button on:click={() => buy_CO3(co2_emit + co2_emit * 0.5)}>150%</button>
    <button on:click={() => buy_CO3(co2_emit * 2)}>200%</button>
</div>