import React, { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Doughnut } from "react-chartjs-2"; // 引入 Doughnut 图表
import axios from "axios";
import "./main.css";

const Home = () => {
    const cryptocurrencies = [
        { id: "bitcoin", name: "Bitcoin", description: "Bitcoin is a decentralized digital currency." },
        { id: "ethereum", name: "Ethereum", description: "Ethereum is a decentralized platform for building dApps." },
        { id: "ripple", name: "Ripple", description: "Ripple is a digital payment protocol." },
        { id: "litecoin", name: "Litecoin", description: "Litecoin is a peer-to-peer cryptocurrency." },
        { id: "cardano", name: "Cardano", description: "Cardano is a blockchain platform for changemakers." },
        { id: "polkadot", name: "Polkadot", description: "Polkadot enables cross-blockchain transfers of data or assets." },
        { id: "dogecoin", name: "Dogecoin", description: "Dogecoin is a cryptocurrency featuring a Shiba Inu dog meme." },
        { id: "solana", name: "Solana", description: "Solana is a high-performance blockchain supporting fast transactions." },
        { id: "binancecoin", name: "Binance Coin", description: "Binance Coin is the cryptocurrency of the Binance platform." },
        { id: "tron", name: "TRON", description: "TRON is a blockchain-based decentralized platform for digital content." },
        { id: "shiba-inu", name: "Shiba Inu", description: "Shiba Inu is a meme cryptocurrency inspired by Dogecoin." },
        { id: "avalanche", name: "Avalanche", description: "Avalanche is a platform for decentralized applications and custom blockchains." },
        { id: "uniswap", name: "Uniswap", description: "Uniswap is a decentralized trading protocol for cryptocurrencies." },
        { id: "chainlink", name: "Chainlink", description: "Chainlink is a decentralized oracle network for smart contracts." },
        { id: "stellar", name: "Stellar", description: "Stellar is a platform for cross-border payments and digital assets." },
        { id: "monero", name: "Monero", description: "Monero is a privacy-focused cryptocurrency." },
        { id: "tezos", name: "Tezos", description: "Tezos is a blockchain platform for smart contracts and decentralized applications." },
        { id: "cosmos", name: "Cosmos", description: "Cosmos is a network of interoperable blockchains." },
        { id: "vechain", name: "VeChain", description: "VeChain is a blockchain platform for supply chain management." },
      ];

  const [selectedCoin, setSelectedCoin] = useState(null);
  const [marketShares, setMarketShares] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarketShares = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets",
          { params: { vs_currency: "usd", ids: cryptocurrencies.map((coin) => coin.id).join(",") } }
        );

        const shares = response.data.map((coin) => ({
          name: coin.name,
          marketCap: coin.market_cap,
        }));

        setMarketShares(shares);
      } catch (error) {
        console.error("Error fetching market shares:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketShares();
  }, []);

  const doughnutData = {
    labels: marketShares.map((coin) => coin.name),
    datasets: [
      {
        data: marketShares.map((coin) => coin.marketCap),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
        ],
      },
    ],
  };

  return (
    <div className="home-page">
      <Header />
      <div className="main-container">
        <Sidebar cryptocurrencies={cryptocurrencies} setSelectedCoin={setSelectedCoin} />
        <main className="main-content">
          <div className="chart-container">
            <h3>Market Share (Top 10 Cryptocurrencies)</h3>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <Doughnut data={doughnutData} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;