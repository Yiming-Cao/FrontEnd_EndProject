import React, { useEffect, useRef } from "react";

const TradingViewScreenerWidget = () => {
  const containerRef = useRef();

  useEffect(() => {
    // 清空容器，避免重复插入
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
    }

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-screener.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "width": "100%",
        "height": "100%",
        "defaultColumn": "overview",
        "screener_type": "crypto_mkt",
        "displayCurrency": "USD",
        "colorTheme": "dark",
        "locale": "en"
      }`;
    containerRef.current.appendChild(script);
  }, []); // 空依赖数组，确保只运行一次

  return (
    <div className="tradingview-widget-container" ref={containerRef} style={{ height: "100%", width: "100%" }}>
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
};

export default TradingViewScreenerWidget;