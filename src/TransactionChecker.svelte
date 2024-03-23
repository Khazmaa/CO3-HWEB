<script>
    let address = '';
    let transactionsCount = '';
  
    async function fetchTransactionsCount(address) {
      const url = `https://api.ghostnet.tzkt.io/v1/accounts/${address}/operations/count`;
      console.log ("url = ", url);
      try {
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Problème lors de la récupération du nombre de transactions');
        }
        const count = await response.text(); // Utiliser .text() car l'API retourne un nombre brut
        transactionsCount = `Nombre de transactions : ${count}`;
      } catch (error) {
        console.error('Erreur lors de la récupération des transactions:', error);
        transactionsCount = 'Impossible de récupérer le nombre de transactions. Vérifiez l\'adresse.';
      }
    }
  
    // Fonction pour gérer la soumission du formulaire
    function handleSubmit() {
      if (!address) {
        alert('Veuillez entrer une adresse Tezos valide.');
        return;
      }
      fetchTransactionsCount(address);
    }
  </script>
  
  <div>
    <input type="text" bind:value={address} placeholder="Entrez votre adresse Tezos ici">
    <button on:click={handleSubmit}>Vérifier le nombre de transactions</button>
    <p>{transactionsCount}</p>
  </div>
  