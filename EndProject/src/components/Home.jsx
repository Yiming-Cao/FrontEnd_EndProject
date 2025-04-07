import React, { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Doughnut } from "react-chartjs-2"; // 引入 Doughnut 图表
import axios from "axios";
import "./main.css";
import { useNavigate } from "react-router-dom";
import TradingViewScreenerWidget from "./TradingViewScreenerWidget";

const Home = () => {
    const cryptocurrencies = [
        { id: "bitcoin", name: "Bitcoin", description: "Bitcoin is a decentralized digital currency." },
        { id: "ethereum", name: "Ethereum", description: "Ethereum is a decentralized platform for building dApps." },
        { id: "ripple", name: "XRP", description: "Ripple is a digital payment protocol." },
        { id: "litecoin", name: "Litecoin", description: "Litecoin is a peer-to-peer cryptocurrency." },
        { id: "cardano", name: "Cardano", description: "Cardano is a blockchain platform for changemakers." },
        { id: "polkadot", name: "Polkadot", description: "Polkadot enables cross-blockchain transfers of data or assets." },
        { id: "dogecoin", name: "Dogecoin", description: "Dogecoin is a cryptocurrency featuring a Shiba Inu dog meme." },
        { id: "solana", name: "Solana", description: "Solana is a high-performance blockchain supporting fast transactions." },
        { id: "binancecoin", name: "BNB", description: "Binance Coin is the cryptocurrency of the Binance platform." },
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
  const [searchTerm, setSearchTerm] = useState(""); // 搜索框的输入值
  const [filteredCoins, setFilteredCoins] = useState([]); // 搜索结果
  const navigate = useNavigate();
  const [amount, setAmount] = useState(1);
  const [selectedCurrency, setSelectedCurrency] = useState("bitcoin");
  const [conversionRate, setConversionRate] = useState(null);
  const [favorites, setFavorites] = useState([]); // 存储被收藏的虚拟币

  const toggleFavorite = (coin) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.some((fav) => fav.id === coin.id)) {
        // 如果已经收藏，则取消收藏
        return prevFavorites.filter((fav) => fav.id !== coin.id);
      } else {
        // 如果未收藏，则添加到收藏列表
        return [coin, ...prevFavorites];
      }
    });
  };

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites)); // 将 JSON 字符串解析为对象
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites)); // 将对象转换为 JSON 字符串
  }, [favorites]);

  const sortedCoins = [
    ...favorites,
    ...marketShares.filter((coin) => !favorites.some((fav) => fav.id === coin.id)),
  ];

  
  const handleCoinClick = (coin) => {
    navigate(`/dashboard/${coin.id}`); // 跳转到 Dashboard 页面并传递虚拟币 ID
  };

  useEffect(() => {
    const fetchMarketShares = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets",
          { params: { vs_currency: "usd", ids: cryptocurrencies.map((coin) => coin.id).join(",") } }
        );

        const shares = response.data.map((coin) => {
          const matchedCrypto = cryptocurrencies.find((c) => c.name === coin.name);
          return {
            id: matchedCrypto ? matchedCrypto.id : null, // 确保包含 id 属性
            name: matchedCrypto ? matchedCrypto.name : coin.name, // 使用匹配的名称
            marketCap: coin.market_cap,
            currentPrice: coin.current_price,
            priceChange: coin.price_change_percentage_24h, // 获取24小时涨跌幅
            logo: coin.image, // 获取 logo URL
          };
        });

        setMarketShares(shares);
        setFilteredCoins(shares); // 初始化搜索结果为全部数据

      } catch (error) {
        console.error("Error fetching market shares:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketShares();
  }, []);

  // 监听搜索框输入，实时更新搜索结果
  useEffect(() => {
    const results = marketShares.filter((coin) =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCoins(results);
  }, [searchTerm, marketShares]);

  useEffect(() => {
    const fetchConversionRate = async () => {
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/simple/price?ids=${selectedCurrency}&vs_currencies=usd`
        );
        setConversionRate(response.data[selectedCurrency].usd);
      } catch (error) {
        console.error("Error fetching conversion rate:", error);
      }
    };
  
    fetchConversionRate();
  }, [selectedCurrency]);

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
          <main className="main-content-2">
            <div className="left-container">
              {/* 搜索框 */}
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search cryptocurrencies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    fontSize: "16px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>
              <div className="chart-container">
                <h3>Market Share (Top 10 Cryptocurrencies)</h3>
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <Doughnut data={doughnutData} />
                )}
              </div>
              <div className="calculator-container">
                <h3>Crypto Calculator</h3>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={{ marginBottom: "10px", padding: "5px", width: "95%" }}
                />
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  style={{ marginBottom: "10px", padding: "5px", width: "100%" }}
                >
                  {cryptocurrencies.map((coin) => (
                    <option key={coin.id} value={coin.id}>
                      {coin.name}
                    </option>
                  ))}
                </select>
                {conversionRate ? (
                  <p>
                    {amount} {selectedCurrency.toUpperCase()} = ${(amount * conversionRate).toLocaleString()} USD
                  </p>
                ) : (
                  <p>Loading...</p>
                )}
              </div>
            </div>
            <div className="grid-container-2">
              {searchTerm.trim() && filteredCoins.length > 0 ? (
                filteredCoins.map((coin) => (
                  <div
                    key={coin.id}
                    className="grid-box box1"
                    onClick={() => handleCoinClick(coin)}
                  >
                    <div
                      className="favorite-icon"
                      onClick={(e) => {
                        e.stopPropagation(); // 防止触发父级的点击事件
                        toggleFavorite(coin);
                      }}
                      style={{ color: favorites.some((fav) => fav.id === coin.id) ? "yellow" : "#ccc" }}
                    >
                      ☆
                    </div>
                    <img
                      src={coin.logo}
                      alt={`${coin.name} logo`}
                      className="coin-logo"
                      style={{ width: "40px", height: "40px", marginBottom: "10px" }}
                    />
                    <p>{coin.name}</p>
                    <p>Price: ${coin.currentPrice.toLocaleString()}</p>
                    <p
                      style={{
                        color: coin.priceChange > 0 ? "green" : "red",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      {coin.priceChange > 0 ? "▲" : "▼"} {Math.abs(coin.priceChange).toFixed(2)}%
                    </p>
                  </div>
                ))
              ) : searchTerm.trim() && filteredCoins.length === 0 ? (
                <p>No matching cryptocurrencies found.</p>
              ) : (
                sortedCoins.map((coin) => (
                  <div
                    key={coin.id}
                    className="grid-box box1"
                    onClick={() => handleCoinClick(coin)}
                  >
                    <div
                      className="favorite-icon"
                      onClick={(e) => {
                        e.stopPropagation(); // 防止触发父级的点击事件
                        toggleFavorite(coin);
                      }}
                      style={{ color: favorites.some((fav) => fav.id === coin.id) ? "yellow" : "#ccc" }}
                    >
                      ☆
                    </div>
                    <img
                      src={coin.logo}
                      alt={`${coin.name} logo`}
                      className="coin-logo"
                      style={{ width: "40px", height: "40px", marginBottom: "10px" }}
                    />
                    <p>{coin.name}</p>
                    <p>Price: ${coin.currentPrice.toLocaleString()}</p>
                    <p
                      style={{
                        color: coin.priceChange > 0 ? "green" : "red",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      {coin.priceChange > 0 ? "▲" : "▼"} {Math.abs(coin.priceChange).toFixed(2)}%
                    </p>
                  </div>
                ))
              )}
            </div>
          </main>
        </div>
      </div>
    
  );
};

export default Home;