<script>
    import TransactionChecker from './TransactionChecker.svelte';
    import BuyPoint from "./BuyPoint.svelte";


    let nbr_tx = 0;
    let co2_emit = 0;
    let user_check = false;
    let user_buy = false;
    export let walletHandler;
    export let tezos;
</script>

<div>
    {#if walletHandler}
        {#if !user_check && !user_buy}
            <TransactionChecker bind:nbr_tx={nbr_tx} bind:co2_emit={co2_emit} bind:user_check={user_check}
                                walletHandler={walletHandler}/>
        {/if}
        {#if user_check && !user_buy}
            <BuyPoint bind:user_buy={user_buy} {co2_emit} {walletHandler} {tezos}/>
        {/if}
        {#if user_check && user_buy}
            <p>Transaction completed ! Thanks again for your support!</p>
        {/if}
    {/if}
    {#if !walletHandler}
    <style>
        /* Styles spécifiques pour le texte "Please connect your wallet !" */
        .connect-wallet-message {
            font-size: 18px;
            color: #fff; /* Couleur du texte */
            font-weight: bold; /* Texte en gras */
            margin-top: 20px; /* Marge supérieure */
        }
    </style>
    
    <div style="text-align: center;"> <!-- Centrer horizontalement -->
        <p class="connect-wallet-message">Please connect your wallet !</p>
    </div>
    {/if}
</div>