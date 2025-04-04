import React, { useEffect, useRef, memo } from "react";

function TradingViewWidget({ symbol }) {
  const container = useRef();

  useEffect(() => {
    // 清空容器，避免重复插入图表
    if (container.current) {
      container.current.innerHTML = "";
    }

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "autosize": true,
        "symbol": "${symbol}",
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1",
        "locale": "en",
        "allow_symbol_change": true,
        "support_host": "https://www.tradingview.com"
      }`;
    container.current.appendChild(script);

    // 清理函数，确保组件卸载时移除旧的图表
    return () => {
      if (container.current) {
        container.current.innerHTML = ""; // 清空容器内容
      }
    };
  }, [symbol]); // 当 symbol 改变时重新加载图表

  return (
    <div className="tradingview-widget-container" ref={container} style={{ height: "100%", width: "100%" }}>
      <div className="tradingview-widget-container__widget" style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
    </div>
  );
}

export default memo(TradingViewWidget);