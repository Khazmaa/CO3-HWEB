<script>
    import {BeaconWallet} from "@taquito/beacon-wallet";
    import {NetworkType} from "@airgap/beacon-types";
    import {TezosToolkit} from "@taquito/taquito";
    import Checker from "./Checker.svelte";
    import Assos from "./Assos.svelte";
    import AboutUs from './AboutUs.svelte';

    
   
 

    const rpcUrl = "https://ghostnet.ecadinfra.com";
    const tezos = new TezosToolkit(rpcUrl);
    let walletHandler;
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
        <a href="#section1" class="nav-link">Home</a>
        <a href="#section2" class="nav-link">Checker</a>
        <a href="#section3" class="nav-link">Associations</a>
        <a href="#section4" class="nav-link">About Us</a>
    </nav>
    <div class="wallet-and-balance-container">
        {#if walletHandler}
            <span class="bank-balance">Balance: PLACEHOLDER CO3</span>
        {/if}
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

    
    <section id="section1" class="full-screen-section">
        <h1>CO3 : For a Greener Blockchain !</h1>
    
        <div style="text-align: center;">
       
       
            <img src="src/assets/oui.png" alt="oui" class="oui">
            <br>  <br>
        </div>

    </section>
    <section id="section2" class="full-screen-section">
        <h1> Wallet Checker</h1>
        <br>  <br>
        {#key walletHandler}
            <Checker {tezos} {walletHandler}/>
        {/key} 
        

        <br>
    </section>
    <section id="section3" class="full-screen-section">
        <br>
        <h1>Organizations We Support </h1>
        <div class="imagemanager">
            <div class="imagee">
                <Assos
                        path_image={"src/assets/parc.png"}
                        description={"Support the Virunga National Park, a place where the lives of the Rangers, guardians of biodiversity, are constantly at stake. This sanctuary is home to endangered species such as mountain gorillas. By making your donation, you are funding vital equipment for these protectors, enabling them to look after the park and its residents without compromising their safety. Your contribution is essential in tackling the threats posed by poaching to the Park's most endangered and iconic wildlife, such as gorillas, lions, elephants and hippos."}
                        bind:withdrawButtonActive={withdrawButtonActive}
                        bind:withdrawButtonLabel={withdrawButtonLabel}
                />
            </div>
            <div class="imageee">
                <Assos
                        path_image={"src/assets/outan.png"}
                        description={"Make a donation to Orangutan Outreach, whose mission is to protect orangutans in their native forests of Borneo and Sumatra while caring for orphaned and displaced orangutans until they can be returned to their natural environment. If they cannot be released, we will do everything in our power to guarantee them a dignified life and the best possible long-term care. Help them raise funds to protect the orang-utans and raise public awareness of conservation issues."}
                        bind:withdrawButtonActive={withdrawButtonActive}
                        bind:withdrawButtonLabel={withdrawButtonLabel}
                />
            </div>
            <div class="imageeee">
                <Assos
                        path_image={"src/assets/tree.png"}
                        description={"Give a donation to One Tree Planted, whose aim is to green the Earth, promote education and ecological awareness of the crucial role of trees, while generating employment. Given the urgent need to regenerate forests devastated by fires and floods, your donation plays a key role. What's more, it offers you a concrete opportunity to reduce your carbon footprint."}
                        bind:withdrawButtonActive={withdrawButtonActive}
                        bind:withdrawButtonLabel={withdrawButtonLabel}
                />
            </div>
        </div>

    </section>
</main>

  

