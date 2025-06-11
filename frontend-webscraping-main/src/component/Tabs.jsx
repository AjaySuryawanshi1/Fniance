import React, { useState } from "react";
import "./Tabs.css";

const Tabs = ({ children, label }) => {
  const [active, setActive] = useState(children[0].props.title);

  return (
    <>
    <div className="summary-box space-y-4 bg-white rounded p-4 shadow">
      <h2 className="summary-title">{label}</h2>
       <br />
      <div className="tabs-header">
        {React.Children.map(children, (child) => (
          <button
            key={child.props.title}
            className={`tab-button ${
              child.props.title === active ? "active" : ""
            }`}
            onClick={() => setActive(child.props.title)}
            type="button"
          >
            {child.props.title}
          </button>
        ))}
      </div>

      <div className="tabs-content">
        {React.Children.map(children, (child) =>
          child.props.title === active ? child : null
        )}
      </div>
    </div>
    </>
  );
};

Tabs.Panel = ({ children }) => <div>{children}</div>;

export default Tabs;