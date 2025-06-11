import React, { useState } from "react";

const formatValue = (value) => {
  if (typeof value === "number") {
    return value.toLocaleString();
  }
  if (typeof value === "string") {
    if (/^\d+(\.\d+)?%$/.test(value)) return value; // already percentage
    if (/^\$?\d+(\.\d+)?$/.test(value)) return value; // currency or plain number
    if (value.includes("%")) return value;
    if (!isNaN(Number(value))) return Number(value).toLocaleString();
  }
  return value;
};

const Table = ({ data = [], headers = null, rows = null }) => {
  const [sortConfig, setSortConfig] = useState(null);

  if ((!Array.isArray(data) || data.length === 0) && !rows) {
    return <p className="table-error">No data available</p>;
  }

  let finalHeaders = headers;
  let finalRows = rows;

  if (data && !headers && !rows) {
    finalHeaders = Object.keys(data[0]);
    finalRows = data.map((row) => finalHeaders.map((key) => row[key]));
  }

  const sortedRows = () => {
    if (!sortConfig || !finalHeaders) return finalRows;
    const { index, direction } = sortConfig;
    return [...finalRows].sort((a, b) => {
      const valA = a[index];
      const valB = b[index];

      const numA = parseFloat(valA?.toString().replace(/[^\d.-]/g, ''));
      const numB = parseFloat(valB?.toString().replace(/[^\d.-]/g, ''));

      if (!isNaN(numA) && !isNaN(numB)) {
        return direction === "asc" ? numA - numB : numB - numA;
      }
      return direction === "asc"
        ? valA?.toString().localeCompare(valB)
        : valB?.toString().localeCompare(valA);
    });
  };

  const handleSort = (index) => {
    if (
      sortConfig &&
      sortConfig.index === index &&
      sortConfig.direction === "asc"
    ) {
      setSortConfig({ index, direction: "desc" });
    } else {
      setSortConfig({ index, direction: "asc" });
    }
  };

  return (
    <table className="custom-table">
      {finalHeaders && (
        <thead>
          <tr>
            {finalHeaders.map((header, idx) => (
              <th
                key={idx}
                onClick={() => handleSort(idx)}
                className="sortable"
              >
                {header}
                {sortConfig?.index === idx && (
                  <span>{sortConfig.direction === "asc" ? " ▲" : " ▼"}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
      )}
      <tbody>
        {sortedRows().map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j}>{formatValue(cell)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;