import React, { useState, useEffect } from "react";
import MainPane from "./component/MainPane";
import Sidebar from "./component/Sidebar";
import "./App.css";

export default function App() {
  const [tree, setTree] = useState(null);        // Company tree data
  const [selected, setSelected] = useState(null); // Currently selected period info
  
  sessionStorage.setItem("userId", 2);
  const userId =   sessionStorage.getItem("userId") || 2;

  useEffect(() => {
    fetch(`http://localhost:5090/api/scrapper/company/tree?userId=${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((response) => {
        if (!response.success || !Array.isArray(response.data)) {
          throw new Error(response.message || "Unexpected API response");
        }

        // Group data by symbol with periods keyed by ym
        const grouped = response.data.reduce((acc, item) => {
          const symbol = item.symbol || item.companyName || "Unknown";
          const companyName = item.companyName || symbol;

          if (!acc[symbol]) {
            acc[symbol] = { company: companyName, periods: {} };
          }

          if (Array.isArray(item.period)) {
            item.period.forEach((p) => {
              if (p.ym) {
                acc[symbol].periods[p.ym] = {
                  pptUrl: p.pptUrl,
                  transcriptUrl: p.transcriptUrl,
                  reportId: p.reportId,
                };
              }
            });
          }

          return acc;
        }, {});

        setTree(grouped);
      })
      .catch((err) => {
        console.error("Failed to load companies:", err);
        setTree({}); // Set empty tree on error
      });
  }, []);

  const handleSelectPeriod = (symbol, ym, paths) => {
    const company = tree?.[symbol]?.company || symbol;
    setSelected({ company, symbol, ym, paths });
  };

  return (
    <div className="app-container">
      <Sidebar tree={tree} onSelectPeriod={handleSelectPeriod} />
      <MainPane selected={selected} />
    </div>
  );
}
