import React from 'react';

export default function Sidebar({ tree, onSelectPeriod }) {
  if (!tree || Object.keys(tree).length === 0) {
    return <p className="text-gray-500 p-4">No companies found.</p>;
  }

  return (
    <aside className="w-64 bg-white shadow p-4 overflow-y-auto max-h-screen">
      <h2 className="text-xl font-semibold mb-4">Companies</h2>
      {Object.entries(tree)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([company, years]) => (
          <details key={company} className="mb-3 border rounded">
            <summary className="cursor-pointer px-3 py-1 font-medium">{company}</summary>
            <ul className="pl-5 pt-2 space-y-1">
              {Object.keys(years)
                .sort((a, b) => b.localeCompare(a))
                .map(ym => (
                  <li key={ym}>
                    <button
                      className="text-blue-600 hover:underline focus:outline-none"
                      onClick={() => onSelectPeriod(company, ym, years[ym])}
                    >
                      {ym.replace('_', ' / ')}
                    </button>
                  </li>
                ))}
            </ul>
          </details>
        ))}
    </aside>
  );
}
