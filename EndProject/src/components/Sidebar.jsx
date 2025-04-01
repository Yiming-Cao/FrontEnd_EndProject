import React from "react";
import "./main.css";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ cryptocurrencies }) => {
    const navigate = useNavigate();
  
    const handleCoinClick = (coin) => {
      navigate(`/dashboard/${coin.id}`); // 跳转到 Dashboard 页面并传递虚拟币 ID
    };
  
    return (
      <aside className="sidebar">
        <nav className="sidebar-nav">
          {cryptocurrencies.map((coin, i) => (
            <div
              key={i}
              className="sidebar-item"
              onClick={() => handleCoinClick(coin)}
            >
              {coin.name}
            </div>
          ))}
        </nav>
      </aside>
    );
  };
  
  export default Sidebar;