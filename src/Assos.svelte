<script>
    export let path_image;
    export let description;
    export let withdrawButtonActive;
    export let withdrawButtonLabel;
    export let tezos;
    export let walletHandler;
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

    
</style>

<div class="wrapper">
    <div class="image">
        <img src="{path_image}" alt="">
        <div class="content">
            <p>{description}</p>
        </div>
        <input type="text" placeholder="Amount">
        <button on:click={() => withdraw(tezos, walletHandler)} disabled={!withdrawButtonActive}>
            {withdrawButtonLabel}
        </button>
    </div>
</div>
