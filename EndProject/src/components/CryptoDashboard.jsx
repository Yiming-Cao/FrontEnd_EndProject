import React, { useState, useEffect, useRef, memo } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Chart, registerables } from "chart.js";
import "chartjs-adapter-date-fns";
Chart.register(...registerables);
import "./main.css";
import Header from "./Header";
import Sidebar from "./Sidebar";
import TradingViewWidget from "./TradingViewWidget"; // 导入 TradingViewWidget 组件

const CryptoDashboard = () => {
  const { coinId } = useParams();
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
    { id: "avalanche", name: "Avalanche", description: "Avalanche is a platform for decentralized applications and custom blockchains." },
    { id: "uniswap", name: "Uniswap", description: "Uniswap is a decentralized trading protocol for cryptocurrencies." },
    { id: "chainlink", name: "Chainlink", description: "Chainlink is a decentralized oracle network for smart contracts." },
    { id: "stellar", name: "Stellar", description: "Stellar is a platform for cross-border payments and digital assets." },
    { id: "monero", name: "Monero", description: "Monero is a privacy-focused cryptocurrency." },
    { id: "tezos", name: "Tezos", description: "Tezos is a blockchain platform for smart contracts and decentralized applications." },
    { id: "cosmos", name: "Cosmos", description: "Cosmos is a network of interoperable blockchains." },
    { id: "vechain", name: "VeChain", description: "VeChain is a blockchain platform for supply chain management." },
  ];

  const [selectedCoin, setSelectedCoin] = useState(cryptocurrencies[0]);
  const [coinData, setCoinData] = useState({});
  const [exchangeRates, setExchangeRates] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const coin = cryptocurrencies.find((c) => c.id === coinId);
    if (coin) {
      setSelectedCoin(coin);
    }
  }, [coinId]); // 监听 coinId 的变化

  useEffect(() => {
    const fetchCoinData = async () => {
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${selectedCoin.id}`
        );

        const data = response.data;

        // 提取需要的数据
        const formattedData = {
          price: data.market_data.current_price.usd,
          marketCap: data.market_data.market_cap.usd,
          totalVolume: data.market_data.total_volume.usd,
          totalSupply: data.market_data.total_supply,
          circulatingSupply: data.market_data.circulating_supply,
          exchangeRates: {
            usd: data.market_data.current_price.usd,
            eur: data.market_data.current_price.eur,
            gbp: data.market_data.current_price.gbp,
          },
        };

        setCoinData(formattedData);
      } catch (error) {
        console.error("Error fetching coin data from CoinGecko", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoinData();

    const interval = setInterval(() => {
      fetchCoinData();
    }, 30000); // 每 30 秒调用一次

    return () => clearInterval(interval); // 清除定时器
  }, [selectedCoin]);

  return (
    <div className="crypto-dashboard">
      <Header />
      <div className="main-container">
        <Sidebar cryptocurrencies={cryptocurrencies} setSelectedCoin={setSelectedCoin} />

        <main className="main-content">
          <div className="grid-container">
            <div className="grid-box box1">
              {selectedCoin && <TradingViewWidget symbol={selectedCoin.id.toUpperCase()} />}
            </div>
            <div className="grid-box box2">
              <h3>Price Now</h3>
              {coinData.price ? (
                <div>
                  <p>${coinData.price.toLocaleString()}</p>
                </div>
              ) : (
                <p>Loading...</p>
              )}
            </div>
            <div className="grid-box box3">
              <h3>Market Cap</h3>
              {coinData.marketCap ? (
                <p>${coinData.marketCap.toLocaleString()}</p>
              ) : (
                <p>Loading...</p>
              )}
            </div>
            <div className="grid-box box4">
              <h3>24h Trading Volume</h3>
              {coinData.totalVolume ? (
                <p>${coinData.totalVolume.toLocaleString()}</p>
              ) : (
                <p>Loading...</p>
              )}
            </div>
            <div className="grid-box box5">
              <h3>Exchange Rates</h3>
              {coinData.exchangeRates ? (
                <div>
                  <p>USD: ${coinData.exchangeRates.usd.toLocaleString()}</p>
                  <p>EUR: €{coinData.exchangeRates.eur.toLocaleString()}</p>
                  <p>GBP: £{coinData.exchangeRates.gbp.toLocaleString()}</p>
                </div>
              ) : (
                <p>Loading...</p>
              )}
            </div>
            <div className="grid-box box6">
              <h3>Supply Data</h3>
              {coinData.totalSupply && coinData.circulatingSupply ? (
                <div>
                  <p>Total Supply: {coinData.totalSupply.toLocaleString()}</p>
                  <p>Circulating Supply: {coinData.circulatingSupply.toLocaleString()}</p>
                </div>
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default memo(CryptoDashboard);