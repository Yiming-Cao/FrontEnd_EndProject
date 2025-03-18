import React from "react";
import "./main.css"; // 引入 CSS 文件

const CryptoDashboard = () => {
  return (
    <div className="crypto-dashboard">
      <header className="main-title">
        <div className="text1">crypto</div>
      </header>
      {/* 侧边栏 */}
      <div className="main-container">
        <aside className="sidebar">
          <div className="sidebar-title">Bitcoin</div>
          <nav className="sidebar-nav">
            {Array(8)
              .fill("")
              .map((_, i) => (
                <div key={i}></div>
              ))}
          </nav>
        </aside>

        {/* 主内容 */}
        
        <main className="main-content">
          {/* 网格布局 */}
          <div className="grid-container">
            <div className="grid-box box1"></div>
            <div className="grid-box box2"></div>
            <div className="grid-box box3"></div>
            <div className="grid-box box4"></div>
            <div className="grid-box box5"></div>
            <div className="grid-box box6"></div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CryptoDashboard;
