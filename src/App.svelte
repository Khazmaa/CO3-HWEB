<script>
  import { BeaconWallet } from "@taquito/beacon-wallet";
  import { NetworkType } from "@airgap/beacon-types";
  import { TezosToolkit } from "@taquito/taquito";
  import TransactionChecker from './TransactionChecker.svelte';

  const rpcUrl = "https://ghostnet.ecadinfra.com";
  const Tezos = new TezosToolkit(rpcUrl); 
  const contractAddress = "KT1R4i4qEaxF7v3zg1M8nTeyrqk8JFmdGLuu";

  let wallet;
  let address;
  let balance;
  let bankBalance;

  let depositAmount = 1;
  let depositButtonActive = false;
  let depositButtonLabel = "Deposit";

  let withdrawButtonActive = true;
  let withdrawButtonLabel = "Withdraw";

  const connectWallet = async () => {
    const newWallet = new BeaconWallet({
      name: "Simple dApp tutorial",
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

  const withdraw = async () => {
    withdrawButtonActive = false;
    withdrawButtonLabel = "Withdrawing...";

    Tezos.setWalletProvider(wallet);
    const contract = await Tezos.wallet.at(contractAddress);

    const transactionParams = await contract.methods
      .withdraw()
      .toTransferParams();
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
    withdrawButtonActive = true;
    withdrawButtonLabel = "Withdraw";
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
      <TransactionChecker />  
      <div class="card">
        {#if wallet}
          <p>L'adresse du wallet connecté est {address}.</p>
          <p>Son solde en tez est {balance}.</p>
          <p>Son solde dans la banque est {bankBalance}.</p>
          <p>
            Pour obtenir des tez, allez à <a href="https://faucet.ghostnet.teztnets.xyz/" target="_blank">
              https://faucet.ghostnet.teztnets.xyz/
            </a>.
          </p>
          <p>
            Déposer des tez :
            <input type="number" bind:value={depositAmount} min="1" max="100" />
            <input type="range" bind:value={depositAmount} min="1" max="100" />
            <button on:click={deposit} disabled={!depositButtonActive}>
              {depositButtonLabel}
            </button>
          </p>
          <p>
            Retirer des tez :
            <button on:click={withdraw} disabled={!withdrawButtonActive}>
              {withdrawButtonLabel}
            </button>
          </p>
          <label for="tezosAddress">Entrez votre adresse Tezos :</label>
          <input type="text" id="tezosAddress" placeholder="Votre adresse Tezos">
          <button id="checkTransactions">Vérifier les transactions</button>
          <div id="transactionsResult">Le nombre de transactions sera affiché ici.</div>
          <p>
            <button on:click={disconnectWallet}> Déconnecter le wallet </button>
          </p>
        {/if}
      </div>
    </section>
  
    <section id="section3" class="full-screen-section">
      <h1>Section 3: Associations</h1>
      <div class="image-container">
        <div class="image-box">
          <img src="src/assets/banquise.jpeg" alt="Description image 1">
          <p>Description image 1</p>
          <input type="text" placeholder="Votre texte ici">
        </div>
        <div class="image-box">
          <img src="src/assets/foret.jpeg" alt="Description image 2">
          <p>Description image 2</p>
          <input type="text" placeholder="Votre texte ici">
        </div>
        <div class="image-box">
          <img src="src/assets/planet.jpeg" alt="Description image 3">
          <p>Description image 3</p>
          <input type="text" placeholder="Votre texte ici">
        </div>
      </div>
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
        <input type="number" bind:value={depositAmount} min="1" max="100" />
        <input type="range" bind:value={depositAmount} min="1" max="100" />
        <button on:click={deposit} disabled={!depositButtonActive}>
          {depositButtonLabel}
        </button>
      </p>
      <p>
        Withdraw tez:
        <button on:click={withdraw} disabled={!withdrawButtonActive}>
          {withdrawButtonLabel}
        </button>
      </p>
      <p>
        <button on:click={disconnectWallet}> Disconnect wallet </button>
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
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.logo-container img {
  height: 100px;
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

.image-container {
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  padding: 20px;
}

.image-box {
  text-align: center;
  width: 30%; /* Ajustez la largeur selon vos besoins */
}

.image-box img {
  width: 100%; /* Ajustez cela pour contrôler la taille de l'image */
  height: auto;
}

.image-box p {
  margin: 10px 0;
}

.image-box input {
  margin-top: 5px;
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


