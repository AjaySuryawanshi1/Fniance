import React from 'react'
import './Style.css'

const FinancialAnalysisSection = ({data}) => {

const formatTitle = (key) =>
  key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

// Paragraph block renderer
const ParagraphBlock = ({ title, text }) => (
  <div className='summary-box'>
    <h3>{title}</h3>
    {text.split("\n\n").map((para, idx) => (
      <p key={idx}>{para}</p>
    ))}
    <br />
  </div>
);

// Handles nested trend_analysis block
const TrendAnalysisBlock = ({ data }) => (
  <div>
    <br />
    <h3 style={{margin:"10px"}}>Trend Analysis</h3>
    <br />
    {Object.entries(data).map(([period, { narrative }], idx) => (
      <div key={idx} className='summary-box'>
        <h4>{formatTitle(period)}</h4>
        {narrative.split("\n\n").map((para, i) => (
          <p key={i}>{para}</p>
        ))}
        <br/>
      </div>
    ))}
  </div>
); 

  return (
   <section>
      {Object.entries(data).map(([key, value]) => {
        if (key === "trend_analysis") {
          return <TrendAnalysisBlock key={key} data={value} />;
        } else {
          return (
            <ParagraphBlock
              key={key}
              title={formatTitle(key)}
              text={value}
            />
          );
        }
      })}
    </section>
  )
}

export default FinancialAnalysisSection