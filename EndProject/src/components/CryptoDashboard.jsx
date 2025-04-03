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

  const idToSymbolMap = {
    bitcoin: "BTC",
    ethereum: "ETH",
    ripple: "XRP",
    litecoin: "LTC",
    cardano: "ADA",
    polkadot: "DOT",
    dogecoin: "DOGE",
    solana: "SOL",
    binancecoin: "BNB",
    tron: "TRX",
    avalanche: "AVAX",
    uniswap: "UNI",
    chainlink: "LINK",
    stellar: "XLM",
    monero: "XMR",
    tezos: "XTZ",
    cosmos: "ATOM",
    vechain: "VET",
  };
  
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
          `https://data-api.coindesk.com/asset/v1/top/list`,
          {
            params: {
              page: 1,
              page_size: 10,
              sort_by: "CIRCULATING_MKT_CAP_USD",
              sort_direction: "DESC",
              groups: "ID,BASIC,SUPPLY,PRICE",
              toplist_quote_asset: "USD",
            },
          }
        );

        const data = response.data?.Data?.LIST;
        if (!data || !Array.isArray(data)) {
          console.error("Invalid API response format: LIST is missing or not an array", response.data);
          return;
        }

        const symbol = idToSymbolMap[selectedCoin.id];
        const coinData = data.find((coin) => coin.SYMBOL === symbol);

        if (!coinData) {
          console.error(`Selected coin (${selectedCoin.id}) not found in API response`);
          return;
        }

        setCoinData(coinData);
      } catch (error) {
        console.error("Error fetching coin data from CoinDesk", error);
      }
    };

    const fetchExchangeRates = async () => {
      try {
        const response = await axios.get(
          `https://data-api.coindesk.com/asset/v1/top/list`,
          {
            params: {
              page: 1,
              page_size: 10,
              sort_by: "CIRCULATING_MKT_CAP_USD",
              sort_direction: "DESC",
              groups: "ID,PRICE",
              toplist_quote_asset: "USD",
            },
          }
        );

        const data = response.data?.Data?.LIST;
        if (!data || !Array.isArray(data)) {
          console.error("Invalid API response format: LIST is missing or not an array", response.data);
          return;
        }

        const symbol = idToSymbolMap[selectedCoin.id];
        const coinData = data.find((coin) => coin.SYMBOL === symbol);

        if (!coinData) {
          console.error(`Selected coin (${selectedCoin.id}) not found in API response`);
          return;
        }

        const rates = {
          usd: coinData.PRICE_USD,
          eur: coinData.PRICE_EUR,
          gbp: coinData.PRICE_GBP,
        };

        setExchangeRates(rates);
      } catch (error) {
        console.error("Error fetching exchange rates from CoinDesk", error);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      try {
        await fetchCoinData();
        await fetchExchangeRates();
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const interval = setInterval(() => {
      fetchCoinData();
      fetchExchangeRates();
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
              <TradingViewWidget symbol={idToSymbolMap[selectedCoin.id]} />
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

export default memo(CryptoDashboard);