
 <script>
  import { BeaconWallet } from "@taquito/beacon-wallet";
  import { NetworkType } from "@airgap/beacon-types";
  import { TezosToolkit } from "@taquito/taquito";
  import TransactionChecker from './TransactionChecker.svelte';
  


  const rpcUrl = "https://ghostnet.ecadinfra.com";
  const Tezos = new TezosToolkit(rpcUrl); 
  const contractAddress = "KT1R4i4qEaxF7v3zg1M8nTeyrqk8JFmdGLuu";
  const contractAddresss = "tz1dzxjsamA2k5cqrNSViFW72EkZyBBS2rZe";

  let wallet;
  let address;
  let balance;
  let bankBalance;
  
  let localNbrTx = 0;
  let nbr_tx = 0;
  let depositAmount = 1;
  let withdrawAmount = 1;
  let depositButtonActive = false;
  let depositButtonLabel = "Buy";
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
    depositButtonLabel = "Buying...";

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
    depositButtonLabel = "Buy";
  };

  const withdraw = async () => {
  try {
    console.log('withdrawAmount', withdrawAmount);
    withdrawButtonActive = false;
    withdrawButtonLabel = "Withdrawing...";

    Tezos.setWalletProvider(wallet);

    // Convert amount to mutez, the smallest unit, as Tezos transactions require
    const amountInMutez = Tezos.format('mutez', 'tz', withdrawAmount);

    // Directly sending XTZ to a wallet address
    const operation = await Tezos.wallet.transfer({
      to: "tz1dzxjsamA2k5cqrNSViFW72EkZyBBS2rZe",
      amount: withdrawAmount,
    }).send();

    console.log(`Waiting for ${operation.opHash} to be confirmed...`);

    await operation.confirmation(2);
    await getWalletBalance(address);
    await getBankBalance(address);

    console.log(`Operation injected: https://ghost.tzstats.com/${operation.opHash}`);

    // Update balances or UI as needed
    withdrawButtonActive = true;
    withdrawButtonLabel = "Withdraw";
  } catch (error) {
    console.error("Withdrawal failed:", error);
    withdrawButtonActive = true; // Reactivate button in case of failure
    withdrawButtonLabel = "Withdraw"; // Reset button label
  }
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
  <div class="wallet-and-balance-container">
    {#key bankBalance}
    {#if wallet}
    
      <span class="bank-balance">Balance: {bankBalance} CO3</span>
    {/if}
    {/key}
    <div class="connect-wallet-container">
      {#if wallet}
        <button on:click={disconnectWallet}>Disconnect Wallet</button>
      {:else}
        <button on:click={connectWallet}>Connect Wallet</button>
      {/if}
    </div>
  </div>
</header>



<main>
  

    <section id="section1" class="full-screen-section">
      <h1>Home</h1>
      <h1 class="logo-title">CO3</h1>
      <div class="logo-title">
        <img src="src/assets/logo.png" alt="Logo" class="logo">
      </div>
      
    </section>
    <section id="section2" class="full-screen-section">
      <h1>Section 2: Checker</h1>
      <TransactionChecker {nbr_tx}/>
      <div class="card">
        {#if wallet}
          <p>L'adresse du wallet connecté est {address}.</p>
          <p>Son solde en tez est {balance}.</p>
          <p>Votre empreine carbone est de {nbr_tx}.</p>
        
         
          <p>
            Voulez-vous remboursez votre empreinte Carbone ? :
            <input type="number" bind:value={nbr_tx} min='nbr_tx' max="100" />
            <input type="range" bind:value={depositAmount} min="1" max="100" />
            <button on:click={deposit} disabled={!depositButtonActive}>
              {depositButtonLabel}
            </button>   
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
          
          <div class="donation-buttons">
            <button on:click={withdraw} disabled={!withdrawButtonActive}>
              {withdrawButtonLabel}
            </button>
       
            Donate CO3 : 
            <input type="number" bind:value={withdrawAmount} min="1" max={bankBalance} />
            <input type="range" bind:value={withdrawAmount} min="1" max={bankBalance} />
            
            
            
    

        </div>
        <div class="image-box">
          <img src="src/assets/foret.jpeg" alt="Description image 2">
          <p>Description image 2</p>
          
          <button on:click={withdraw} disabled={!withdrawButtonActive}>
            {withdrawButtonLabel}
              <div class="donation-buttons">
                <button class="percentage-button">100%</button>
                <button class="percentage-button">150%</button>
                <button class="percentage-button">200%</button>
              </div>
            </div>
   
        </div>

        <div class="image-box">
          <img src="src/assets/planet.jpeg" alt="Description image 3">
          
          <p>Description image 3</p>

          <button on:click={withdraw} disabled={!withdrawButtonActive}>
            {withdrawButtonLabel}

          <div class="donation-buttons">
            <button class="percentage-button">100%</button>
            <button class="percentage-button">150%</button>
            <button class="percentage-button">200%</button>
          </div>
         
          
    
          </button>

           
</main>
 

