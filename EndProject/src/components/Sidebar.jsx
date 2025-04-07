import React from "react";
import "./main.css";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ cryptocurrencies, favorites  }) => {
    const navigate = useNavigate();
  
    const handleCoinClick = (coin) => {
      navigate(`/dashboard/${coin.id}`); // 跳转到 Dashboard 页面并传递虚拟币 ID
    };
  
    return (
      <aside className="sidebar">
        <nav className="sidebar-nav">
          {/* 优先显示收藏的虚拟币 */}
          {favorites.map((coin) => (
            <div
              key={coin.id}
              className="sidebar-item"
              onClick={() => handleCoinClick(coin)}
              style={{ color: "yellow" }} // 收藏的虚拟币名称变为黄色
            >
              {coin.name}
            </div>
          ))}
          {/* 显示未收藏的虚拟币 */}
          {cryptocurrencies
            .filter((coin) => !favorites.some((fav) => fav.id === coin.id))
            .map((coin) => (
              <div
                key={coin.id}
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