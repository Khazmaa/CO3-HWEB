<script>
    import {BeaconWallet} from "@taquito/beacon-wallet";
    import {NetworkType} from "@airgap/beacon-types";
    import {TezosToolkit} from "@taquito/taquito";
    import TransactionChecker from './TransactionChecker.svelte';

    const rpcUrl = "https://ghostnet.ecadinfra.com";
    const Tezos = new TezosToolkit(rpcUrl);
    const contractAddress = "KT1R4i4qEaxF7v3zg1M8nTeyrqk8JFmdGLuu";

    let wallet;
    let address;
    let balance;
    let bankBalance;
    let nbr_tx = 0;

    let depositAmount = 1;
    let walletAddress = "";
    let depositButtonActive = false;
    let depositButtonLabel = "Deposit";

    const connectWallet = async () => {
        const newWallet = new BeaconWallet({
            name: "CO3",
            network: {
                type: NetworkType.GHOSTNET,
            },
        });
        await newWallet.requestPermissions();
        address = await newWallet.getPKH();
        await getWalletBalance(address);
        await getBankBalance(address);
        wallet = newWallet;
        depositButtonActive = true;
        console.log('nbr tx, ', nbr_tx);
    };

    const disconnectWallet = () => {
        wallet.client.clearActiveAccount();
        wallet = undefined;
    };

    const getWalletBalance = async (walletAddress) => {
        const balanceMutez = await Tezos.tz.getBalance(walletAddress);
        balance = balanceMutez.div(1000000).toFormat(2);
    };

    const getBankBalance = async (walletAddress) => {
        const contract = await Tezos.wallet.at(contractAddress);
        const storage = await contract.storage();
        const balanceMutez = await storage.get(walletAddress);
        bankBalance = isNaN(balanceMutez) ? 0 : balanceMutez / 1000000;
    };

    const deposit = async () => {
        depositButtonActive = false;
        depositButtonLabel = "Depositing...";

        Tezos.setWalletProvider(wallet);
        const contract = await Tezos.wallet.at(contractAddress);
        const transactionParams = await contract.methods
            .deposit()
            .toTransferParams({
                amount: depositAmount,
            });
        const estimate = await Tezos.estimate.transfer(transactionParams);

        const operation = await Tezos.wallet
            .transfer({
                ...transactionParams,
                ...estimate,
            })
            .send();

        console.log(`Waiting for ${operation.opHash} to be confirmed...`);

        await operation.confirmation(2);

        console.log(
            `Operation injected: https://ghost.tzstats.com/${operation.opHash}`
        );

        await getWalletBalance(address);
        await getBankBalance(address);
        depositButtonActive = true;
        depositButtonLabel = "Deposit";
    };

</script>


<header class="site-header">
    <div class="logo-container">
        <img src="/path/to/your/logo.png" alt="Logo" class="logo">
    </div>
    <nav class="navbar">
        <a href="#section1" class="nav-link">Home</a>
        <a href="#section2" class="nav-link">Checker</a>
        <a href="#section3" class="nav-link">Associations</a>
    </nav>
    <div class="connect-wallet-container">
        {#if wallet}
            <button on:click={disconnectWallet}>Disconnect Wallet</button>
        {:else}
            <button on:click={connectWallet}>Connect Wallet</button>
        {/if}
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
        <TransactionChecker {nbr_tx}/>
        <div class="card">
            {#if wallet}
                <p>L'adresse du wallet connecté est {address}.</p>
                <p>Son solde en tez est {balance}.</p>
                <p>Son solde dans la banque est {bankBalance}.</p>
                <p>Son nbr de tx est {nbr_tx}</p>
                <p>
                    Pour obtenir des tez, allez à <a href="https://faucet.ghostnet.teztnets.xyz/" target="_blank">
                    https://faucet.ghostnet.teztnets.xyz/
                </a>.
                </p>
                <p>
                    Déposer des tez :
                    <input type="number" bind:value={depositAmount} min="1" max="100"/>
                    <input type="range" bind:value={depositAmount} min="1" max="100"/>
                    <button on:click={deposit} disabled={!depositButtonActive}>
                        {depositButtonLabel}
                    </button>
                </p>
                <label for="tezosAddress">Entrez votre adresse Tezos :</label>
                <input type="text" bind:value={walletAddress} id="tezosAddress" placeholder="Votre adresse Tezos">
                <button id="checkTransactions">Vérifier les transactions</button>
                <div id="transactionsResult">Le nombre de transactions sera affiché ici.</div>
                <p>
                    <button on:click={disconnectWallet}> Déconnecter le wallet</button>
                </p>
            {/if}
        </div>
    </section>

    <section id="section3" class="full-screen-section">
        <h1>Section 3: Associations</h1>
        <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
    </section>


    <div class="card">
        {#if wallet}
            <p>The address of the connected wallet is {address}.</p>
            <p>Its balance in tez is {balance}.</p>
            <p>Its balance in the bank is {bankBalance}.</p>
            <p>
                To get tez, go to <a
                    href="https://faucet.ghostnet.teztnets.xyz/"
                    target="_blank"
            >
                https://faucet.ghostnet.teztnets.xyz/
            </a>.
            </p>
            <p>
                Deposit tez:
                <input type="number" bind:value={depositAmount} min="1" max="100"/>
                <input type="range" bind:value={depositAmount} min="1" max="100"/>
                <button on:click={deposit} disabled={!depositButtonActive}>
                    {depositButtonLabel}
                </button>
            </p>
            <p>
                <button on:click={disconnectWallet}> Disconnect wallet</button>
            </p>


        {/if}
    </div>
</main>


<style>

    body, html {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
    }

    .site-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #f5f5f5;
        padding: 10px 50px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .logo-container img {
        height: 50px;
    }

    .navbar {
        display: flex;
    }

    .nav-link {
        text-decoration: none;
        color: #333;
        margin: 0 15px;
        font-weight: bold;
    }

    .nav-link:hover {
        color: #646cff;
    }

    .connect-wallet-container button {
        padding: 10px 20px;
        font-size: 16px;
        font-weight: bold;
        color: white;
        background-color: #646cff;
        border: none;
        border-radius: 30px;
        cursor: pointer;
        transition: background-color 0.3s, transform 0.2s;
    }

    .connect-wallet-container button:hover {
        background-color: #535bf2;
        transform: translateY(-2px);
    }

    .connect-wallet-container button:active {
        transform: translateY(1px);
    }

</style>


