<script>
    import {MichelsonMap} from "@taquito/taquito";
    import {fetch_co3_balance, check_co3_possession, upload_to_ipfs} from "./check_co3.js";

    const sc_address = import.meta.env.VITE_SC_SBT_ADDRESS;

    const pubkeyAddress = import.meta.env.VITE_PUBKEY_ADMIN;
    export let path_image;
    export let description;
    export let withdrawButtonActive;
    export let withdrawButtonLabel;
    export let tezos;
    export let walletHandler;
    export let bankCO3;

    let amount = '';
    const donateCO3 = async (amount) => {
        if (!walletHandler) {
            alert("Please connect your wallet first !");
            return;
        }
        const address = await walletHandler.getPKH();
        const tok_metadata = await check_co3_possession(tezos, sc_address, address)
        if (tok_metadata === null) {
            alert("You dont have a CO3 Certificate, refund your carbon impact first !");
            return;
        }
        if (tok_metadata.CO3 < amount) {
            alert("You dont have enough CO3 to donate this much ! Here your balance : " + tok_metadata.CO3 + " CO3");
            return
        }
        const op = await tezos.wallet.transfer({to: pubkeyAddress, amount: amount}).send();
        await op.confirmation(1);
        bankCO3 -= amount;
        console.log("Donation done");
    }
</script>

<svelte:head>

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</svelte:head>

<style>
    .wrapper {
        display: flex;
        justify-content: center; /* Center the images horizontally */
        align-items: center; /* Align the images vertically */
        flex-wrap: wrap; /* Allow the items to wrap to the next line on smaller screens */
        gap: 20px; /* Space between the images */
        height: auto; /* Adjust height based on content */
        padding: 10px; /* Padding around the wrapper */
    }

    .image {

        position: relative;
        overflow: hidden;
    }


    .image img {
        width: 100%;
        transition: filter 1.2s;
    }

    .image:hover img {
        filter: blur(8px);
    }


    /* Additional styles */

    .content {
        position: absolute;
        top: 0; /* Ajustez cette valeur pour positionner le texte un peu moins en haut */
        left: 0;
        width: 95%;
        height: 92%;
        display: flex;
        padding: 10px;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: opacity 0.6s;
        text-align: center; /* Centre le texte horizontalement */
    }

    .content p {
        font-size: 1.2em; /* Rend le texte un peu plus grand */
        font-weight: bold; /* Rend le texte en gras */
        color: white; /* Si vous voulez que le texte soit blanc */
        margin: 0; /* Supprime les marges par défaut du paragraphe */
        padding-top: 20px; /* Ajuste la position du texte vers le bas un peu moins depuis le haut */
    }


    .content p {
        font-size: 1.2em; /* Rend le texte un peu plus grand */
        font-weight: bold; /* Rend le texte en gras */
        color: white; /* Si vous voulez que le texte soit blanc */
        margin: 0; /* Supprime les marges par défaut du paragraphe */
        padding-top: 20px; /* Ajuste la position du texte vers le bas un peu moins depuis le haut */
    }


    .image:hover .content {
        opacity: 1;
    }

    .assos-custom-button {
        padding: 9px 24px;
        font-size: 10px;
        background-color: #49b357; /* Couleur de fond */
        color: #fff; /* Couleur du texte */
        border: none; /* Supprime la bordure */
        border-radius: 6px; /* Ajoute des coins arrondis */
        cursor: pointer; /* Curseur de la souris */
        transition: background-color 0.3s, box-shadow 0.2s; /* Animation de transition */
    }

</style>

<div class="wrapper">
    <div class="image">
        <img src="{path_image}" alt="">
        <div class="content">
            <p>{description}</p>
        </div>
        <input type="text" placeholder="Amount" bind:value={amount}>
        <button class="assos-custom-button" on:click={() => donateCO3(amount)} disabled={!withdrawButtonActive}>
            Donate
        </button>
    </div>
</div>
