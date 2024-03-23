<script>
    import {BeaconWallet} from "@taquito/beacon-wallet";
    import {NetworkType} from "@airgap/beacon-types";
    import {TezosToolkit} from "@taquito/taquito";
    import Checker from "./Checker.svelte";

    import {getBalanceCO3, withdraw, bankCO3} from './Bank.js'

    const rpcUrl = "https://ghostnet.ecadinfra.com";
    const tezos = new TezosToolkit(rpcUrl);
    let walletHandler;
    let address;
    let withdrawButtonActive = true;
    let withdrawButtonLabel = "Donate";


    const connectWallet = async () => {
        const newWallet = new BeaconWallet({
            name: "Simple dApp tutorial",
            network: {
                type: NetworkType.GHOSTNET,
            },
        });
        await newWallet.requestPermissions();
        address = await newWallet.getPKH();
        await getBalanceCO3(tezos, address);
        walletHandler = newWallet;
    };

    const disconnectWallet = () => {
        walletHandler.client.clearActiveAccount();
        walletHandler = undefined;
    };

</script>


<header class="site-header">
    <div class="logo-container">
        <img src="src/assets/logo.png" alt="Logo" class="logo">
    </div>
    <nav class="navbar">
        <a href="css/style.css" class="nav-link">Home</a>
        <a href="#section2" class="nav-link">Checker</a>
        <a href="#section3" class="nav-link">Associations</a>
    </nav>
    <div class="wallet-and-balance-container">
        {#key $bankCO3}
            {#if walletHandler}
                <span class="bank-balance">Balance: {$bankCO3} CO3</span>
            {/if}
        {/key}
        <div class="connect-wallet-container">
            {#if walletHandler}
                <button on:click={disconnectWallet}>Disconnect Wallet</button>
            {:else}
                <button on:click={connectWallet}>Connect Wallet</button>
            {/if}
        </div>
    </div>
</header>


<main>

    <h1>CO3</h1>
    <section id="section1" class="full-screen-section">
        <h1>Section 1: Home</h1>
        <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
    </section>
    <section id="section2" class="full-screen-section">
        <h1>Section 2: Checker</h1>
        <Checker {tezos} {walletHandler}></Checker>
    </section>

    <section id="section3" class="full-screen-section">
        <h1>Section 3: Associations</h1>
        <div class="wrapper">
            <div class="image">
                <img src="src/assets/outan.png" alt="Description image 1">
                <div class="content">
                <p>Description image 1</p>
            
              </div>
            </div>
            <div class="image-box">
                <img src="src/assets/parc.png" alt="Description image 2">
                <p>Description image 2</p>
                <input type="text" placeholder="Votre texte ici">
                <button on:click={withdraw} disabled={!withdrawButtonActive}>
                    {withdrawButtonLabel}
                </button>  
            </div>
            <div class="image-box">
                <img src="src/assets/tree.png" alt="Description image 3">
                <p>Description image 3</p>
                <input type="text" placeholder="Votre texte ici">

                <button on:click={() => {
                    withdraw(tezos, walletHandler)
                }} disabled={!withdrawButtonActive}>
                    {withdrawButtonLabel}
                </button>
            </div>
        </div>
    </section>
</main>
