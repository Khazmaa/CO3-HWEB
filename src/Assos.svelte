<script>

    import {withdraw} from "./Bank.js";

    export let path_image;
    export let description;
    export let withdrawButtonActive;
    export let withdrawButtonLabel;
    export let tezos;
    export let walletHandler;

</script>

<div class="image-box">
    <img src={path_image} alt={description}>
    <p>Description image 1</p>
    <input type="text" placeholder="Amount">
    <button on:click={() => withdraw(tezos, walletHandler)} disabled={!withdrawButtonActive}>
        {withdrawButtonLabel}
    </button>
</div>