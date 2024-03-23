import './app.css'
import App from './App.svelte'

const app = new App({
  target: document.body,
})
document.getElementById('checkTransactions').addEventListener('click', async () => {
  const address = document.getElementById('tezosAddress').value;
  if (!address) {
    alert('Veuillez entrer une adresse Tezos.');
    return;
  }

  const transactions = await fetchTransactionsForAddress(address);
  document.getElementById('transactionsResult').textContent = `Nombre de transactions : ${transactions.length}`;
});

async function fetchTransactionsForAddress(address) {
  const url = `https://api.tzkt.io/v1/accounts/${address}/operations`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    // Vous pouvez filtrer ou ajuster les données selon vos besoins ici
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des transactions:', error);
    alert('Erreur lors de la récupération des transactions. Veuillez réessayer.');
    return [];
  }
}


export default app
