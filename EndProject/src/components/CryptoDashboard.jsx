import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Chart, registerables } from "chart.js";
import { CandlestickController, CandlestickElement } from "chartjs-chart-financial";
import { Doughnut } from "react-chartjs-2"; // 引入 Doughnut 图表
import "chartjs-adapter-date-fns";
Chart.register(...registerables, CandlestickController, CandlestickElement);
import "./main.css";
import Header from "./Header";
import Sidebar from "./Sidebar";

const CryptoDashboard = () => {
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

  const [selectedCoin, setSelectedCoin] = useState(cryptocurrencies[0]);
  const [prices, setPrices] = useState([]);
  const [coinData, setCoinData] = useState({});
  const [loading, setLoading] = useState(true);
  const [exchangeRates, setExchangeRates] = useState(null);
  const [ohlcData, setOhlcData] = useState([]);
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  // 缓存对象
  const cache = {
    prices: {},
    coinData: {},
    exchangeRates: {},
    ohlcData: {},
  };

  useEffect(() => {
    const fetchPrices = async () => {
      if (cache.prices[selectedCoin.id]) {
        setPrices(cache.prices[selectedCoin.id]);
        return;
      }

      try {
        const response = await axios.get(
          `/api/api/v3/coins/${selectedCoin.id}/market_chart`,
          { params: { vs_currency: "usd", days: 7 } }
        );
        cache.prices[selectedCoin.id] = response.data.prices; // 缓存数据
        setPrices(response.data.prices);
      } catch (error) {
        console.error("Error fetching price data from CoinGecko", error);
      }
    };

    const fetchCoinData = async () => {
      if (cache.coinData[selectedCoin.id]) {
        setCoinData(cache.coinData[selectedCoin.id]);
        return;
      }

      try {
        const response = await axios.get(`/api/api/v3/coins/${selectedCoin.id}`);
        cache.coinData[selectedCoin.id] = response.data.market_data; // 缓存数据
        setCoinData(response.data.market_data);
      } catch (error) {
        console.error("Error fetching coin data from CoinGecko", error);
      }
    };

    const fetchExchangeRates = async () => {
      if (cache.exchangeRates[selectedCoin.id]) {
        setExchangeRates(cache.exchangeRates[selectedCoin.id]);
        return;
      }

      try {
        const response = await axios.get(`/api/api/v3/simple/price`, {
          params: { ids: selectedCoin.id, vs_currencies: "usd,eur,gbp" },
        });
        cache.exchangeRates[selectedCoin.id] = response.data[selectedCoin.id]; // 缓存数据
        setExchangeRates(response.data[selectedCoin.id]);
      } catch (error) {
        console.error("Error fetching exchange rates", error);
      }
    };


    setLoading(true);
    fetchPrices();
    fetchCoinData();
    fetchExchangeRates();
    setLoading(false);
  }, [selectedCoin]);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy(); // 销毁已有的 Chart 实例
    }

    if (canvasRef.current) {
      const formattedPrices = prices.map(([timestamp, price]) => ({
        x: new Date(timestamp),
        y: price,
      }));

      chartRef.current = new Chart(canvasRef.current, {
        type: "line",
        data: {
          datasets: [
            {
              label: `${selectedCoin.name} Price (USD)`,
              data: formattedPrices,
              borderColor: "rgb(75, 192, 192)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              tension: 0.2, // 平滑曲线
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: {
              type: "time",
              time: {
                unit: "day",
              },
            },
            y: {
              beginAtZero: false,
            },
          },
          plugins: {
            legend: {
              display: true, // 显示图例
            },
          },
        },
      });
    }
  }, [prices]);

  return (
    <div className="crypto-dashboard">
      <Header />
      <div className="main-container">
        <Sidebar cryptocurrencies={cryptocurrencies} setSelectedCoin={setSelectedCoin} />

        <main className="main-content">
          <div className="grid-container">
            <div className="grid-box box1">
              <h3>Price Chart (K-Line)</h3>
              {loading ? <p>Loading...</p> : <canvas ref={canvasRef} />}
            </div>
            <div className="grid-box box2">
              <h3>All-Time High / Low</h3>
              {coinData.ath && coinData.atl ? (
                <div>
                  <p>ATH: ${coinData.ath.usd.toLocaleString()}</p>
                  <p>ATL: ${coinData.atl.usd.toLocaleString()}</p>
                </div>
              ) : (
                <p>Loading...</p>
              )}
            </div>
            <div className="grid-box box3">
              <h3>Market Cap</h3>
              {coinData.market_cap ? (
                <p>${coinData.market_cap.usd.toLocaleString()}</p>
              ) : (
                <p>Loading...</p>
              )}
            </div>
            <div className="grid-box box4">
              <h3>24h Trading Volume</h3>
              {coinData.total_volume ? (
                <p>${coinData.total_volume.usd.toLocaleString()}</p>
              ) : (
                <p>Loading...</p>
              )}
            </div>
            <div className="grid-box box5">
              <h3>Exchange Rates</h3>
              {exchangeRates ? (
                <div>
                  <p>USD: ${exchangeRates.usd}</p>
                  <p>EUR: €{exchangeRates.eur}</p>
                  <p>GBP: £{exchangeRates.gbp}</p>
                </div>
              ) : (
                <p>Loading...</p>
              )}
            </div>
            <div className="grid-box box6">
              <h3>Supply Data</h3>
              {coinData.total_supply && coinData.circulating_supply ? (
                <div>
                  <p>Total Supply: {coinData.total_supply.toLocaleString()}</p>
                  <p>Circulating Supply: {coinData.circulating_supply.toLocaleString()}</p>
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

export default CryptoDashboard;