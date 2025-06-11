import React, { useState } from "react";

function Sidebar({ tree, onSelectPeriod }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState(null);
  const userId =   sessionStorage.getItem("userId");

  const handleGenerateAllSummaries = async () => {
    setIsGenerating(true);
    setMessage(null);
    try {
      const response = await fetch(`http://localhost:5090/api/scrapper/run?userId=${encodeURIComponent(userId)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to generate summaries: ${errorText}`);
      }

      const result = await response.json();
      setMessage({
        type: result.success ? "success" : "error",
        text:
          result.message ||
          (result.success
            ? "Summaries generated successfully!"
            : "Failed to generate summaries"),
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Unknown error occurred",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const isEmpty = !tree || Object.keys(tree).length === 0;

  return (
    <aside className="sidebar">
      <button
        className="btn blue"
        onClick={handleGenerateAllSummaries}
        disabled={isGenerating}
        style={{ marginBottom: "1rem" }}
      >
        {isGenerating ? "Generating..." : "Generate Summary"}
      </button>

      {message && <div className={`alert ${message.type}`}>{message.text}</div>}

      <h2 className="sidebar-title">Companies</h2>

      {isEmpty ? (
        <p className="text-muted">No companies to display.</p>
      ) : (
        Object.entries(tree)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([symbol, info]) => (
            <details key={symbol} className="company-details">
              <summary className="company-name">{info.company}</summary>
              <ul className="year-list" style={{ paddingLeft: "1rem" }}>
                {Object.keys(info.periods)
                  .sort((a, b) => b.localeCompare(a)) // latest first
                  .map((ym) => (
                    <li key={ym}>
                      <a
                        href="#"
                        className="link"
                        onClick={(e) => {
                          e.preventDefault();
                          onSelectPeriod(symbol, ym, info.periods[ym]);
                        }}
                      >
                        {ym.replace("_", " / ")}
                      </a>
                    </li>
                  ))}
              </ul>
            </details>
          ))
      )}
    </aside>
  );
}

export default Sidebar;
