<script>
    import TransactionChecker from './TransactionChecker.svelte';
    import BuyPoint from "./BuyPoint.svelte";
    import NftEmiter from "./NftEmiter.svelte";


    let nbr_tx = 0;
    let co2_emit = 0;
    let user_check = false;
    let user_buy = false;
    let user_emit = false;
    export let walletHandler;
    export let tezos;

    console.log("user_check = ", user_check);
    console.log("user_buy = ", user_buy);
    console.log("user_emit = ", user_emit);
</script>

<div>
    {#if !user_check && !user_buy && !user_emit}
        <TransactionChecker bind:nbr_tx={nbr_tx} bind:co2_emit={co2_emit} bind:user_check={user_check}/>
    {/if}
    {#if user_check && !user_buy && !user_emit}
        {#if walletHandler}
            <BuyPoint bind:user_buy={user_buy} {co2_emit} {walletHandler} {tezos}/>
        {/if}
        {#if !walletHandler}
            <p>Please connect your wallet !</p>
        {/if}
    {/if}
    {#if (user_check && user_buy && !user_emit)}
        <NftEmiter bind:user_emit={user_emit} {tezos}/>
    {/if}
    {#if user_check && user_buy && user_emit}
        <p>Congrats for your dedication and your support!</p>
    {/if}
</div>