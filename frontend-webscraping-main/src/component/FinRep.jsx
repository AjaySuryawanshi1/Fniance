import React from "react";
import Tabs from "./Tabs.jsx";
import Table from "./Table.jsx";
import "./FinRep.css"; 

function FinancialReport({ data }) {
  const { metadata, data_extraction, financial_analysis } = data;

  const formatNumber = (n) =>
    n == null ? "–" : Number(n).toLocaleString("en-IN");

  const formatPercent = (p) => (p == null ? "–" : `${Number(p).toFixed(2)}%`);

  const formatCurrency = (val, symbol = "₹") =>
    val == null ? "–" : symbol + formatNumber(val);

  const renderMetadata = () => (
    <div>
      <div className="summary-box space-y-4 bg-white rounded p-4 shadow">
        <h2 className="summary-title">Metadata</h2>
        <br />
        <div className="metadata-row">
          <span className="metadata-label">Company:</span>
          <span className="metadata-value">{metadata.company}</span>
        </div>

        <div className="metadata-row">
          <span className="metadata-label">Generated On:</span>
          <span className="metadata-value">{metadata.report_generated_on}</span>
        </div>

        <div className="metadata-row">
          <span className="metadata-label">Currency Symbols:</span>
          <span className="metadata-value">
            INR ({metadata.base_currency.inr}) | USD (
            {metadata.base_currency.usd})
          </span>
        </div>
      </div>
      <div className="summary-box space-y-4 bg-white rounded p-4 shadow">
        <h3 className="summary-title">Source Documents</h3>
        <br />
        <ul className="source-list">
          {metadata.source_documents.map((doc, i) => (
            <li key={i} className="source-item">
              <span className="doc-type">{doc.type}:</span>
              <span className="doc-name">{doc.file_name}</span>
              <span className="doc-period">{doc.period_covered}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderPeriodPane = (label, period, isQuarter) => {
    const revenue = period.revenue || {};
    const profitability = period.profitability || {};
    const cash = period.cash_flow_balance_sheet || {};
    const segment = period.segment_performance || {};
    const geographic = period.geographic_performance || {};
    const orderBook = period.order_book || {};
    const headcount = period.headcount_metrics || {};
    const dividend = period.dividend || {};
    console.log(segment);
    return (
      <Tabs label={label}>
        <Tabs.Panel title="Revenue">
          <Table
            headers={
              isQuarter
                ? [
                    "Total (INR)",
                    "Total (USD)",
                    "CC QoQ %",
                    "CC YoY %",
                    "USD QoQ %",
                    "USD YoY %",
                  ]
                : ["Total (INR)", "Total (USD)", "CC YoY %", "USD YoY %"]
            }
            rows={[
              isQuarter
                ? [
                    formatCurrency(revenue.total_inr),
                    formatCurrency(revenue.total_usd, "$"),
                    formatPercent(revenue.cc_growth_pct?.qoq),
                    formatPercent(revenue.cc_growth_pct?.yoy),
                    formatPercent(revenue.usd_growth_pct?.qoq),
                    formatPercent(revenue.usd_growth_pct?.yoy),
                  ]
                : [
                    formatCurrency(revenue.total_inr),
                    formatCurrency(revenue.total_usd, "$"),
                    formatPercent(revenue.cc_growth_pct_yoy),
                    formatPercent(revenue.usd_growth_pct_yoy),
                  ],
            ]}
          />
        </Tabs.Panel>

        <Tabs.Panel title="Profitability">
          <Table
            headers={[
              "Gross %",
              "EBITDA (INR)",
              "EBITDA %",
              "EBIT (INR)",
              "EBIT %",
              "PAT (INR)",
              "PAT (USD)",
              "PAT %",
              "EPS (INR)",
            ]}
            rows={[
              [
                formatPercent(profitability.gross_margin_pct),
                formatCurrency(profitability.ebitda_inr),
                formatPercent(profitability.ebitda_margin_pct),
                formatCurrency(profitability.ebit_inr),
                formatPercent(profitability.ebit_margin_pct),
                formatCurrency(profitability.pat_inr),
                formatCurrency(profitability.pat_usd, "$"),
                formatPercent(profitability.pat_margin_pct),
                formatCurrency(profitability.basic_eps_inr),
              ],
            ]}
          />
        </Tabs.Panel>

        <Tabs.Panel title="Order Book">
          <Table
            rows={[
              [
                "TCV:",
                formatNumber(orderBook.tcv_new_deals || orderBook.tcv_fy),
              ],
              ["Pipeline:", orderBook.pipeline_commentary || "–"],
            ]}
          />
        </Tabs.Panel>

        <Tabs.Panel title="Cash & Balance Sheet">
          <Table
            rows={[
              ["OCF / PAT:", formatPercent(cash.ocf_to_pat_ratio)],
              ["FCF / PAT:", formatPercent(cash.fcf_to_pat_ratio)],
              [
                "Cash & Investments:",
                `${formatCurrency(
                  cash.cash_and_investments_inr
                )} (${formatCurrency(cash.cash_and_investments_usd, "$")})`,
              ],
              ["DSO:", `${formatNumber(cash.dso_days)} days`],
            ]}
          />
        </Tabs.Panel>

        <Tabs.Panel title="Segment Performance">
          <Table
            headers={
              isQuarter
                ? ["Segment", "Revenue INR", "Growth QoQ %"]
                : ["Segment", "Revenue INR", "Growth YoY %"]
            }
            rows={segment.map((seg) => [
              seg.segment,
              formatCurrency(seg.revenue_inr, "$"),
              isQuarter
                ? formatPercent(seg.growth_pct_qoq)
                : formatPercent(seg.growth_pct_yoy),
            ])}
          />
        </Tabs.Panel>

        <Tabs.Panel title="Geographic Performance">
          <Table
            headers={
              isQuarter
                ? ["Region", "Revenue INR", "Growth QoQ %"]
                : ["Region", "Revenue INR", "Growth YoY %"]
            }
            rows={geographic.map((seg) => [
              seg.region,
              formatCurrency(seg.revenue_inr, "$"),
              isQuarter
                ? formatPercent(seg.growth_pct_qoq)
                : formatPercent(seg.growth_pct_yoy),
            ])}
          />
        </Tabs.Panel>

        <Tabs.Panel title="Headcount">
          <Table
            rows={[
              ["Total:", formatNumber(headcount.total_headcount)],
              ["Net Additions YoY:", formatNumber(headcount.net_additions_yoy)],
              ["Attrition:", formatPercent(headcount.attrition_pct_ttm)],
              [
                "Utilization (ex-trainees):",
                formatPercent(headcount.utilization_excl_trainees_pct),
              ],
            ]}
          />
        </Tabs.Panel>

        <Tabs.Panel title="Dividend">
          <Table
            rows={[
              [
                "Dividend per Share:",
                formatCurrency(
                  dividend.final_dividend_per_share_inr ||
                    dividend.total_dividend_per_share_inr
                ),
              ],
            ]}
          />
        </Tabs.Panel>
      </Tabs>
    );
  };

  const renderCommentary = () => (
    <div className="summary-box space-y-4 bg-white rounded p-4 shadow">
      <h2 className="summary-title">Financial Summary</h2>
      <p className="text-sm">{financial_analysis.performance_summary}</p>
      <p className="text-sm font-semibold">Trend Analysis (Quarter):</p>
      <p className="text-sm">
        {financial_analysis.trend_analysis?.latest_quarter?.narrative ||
          "No commentary available"}
      </p>
      <p className="text-sm font-semibold">Trend Analysis (Full Year):</p>
      <p className="text-sm">
        {financial_analysis.trend_analysis?.full_year?.narrative ||
          "No commentary available"}
      </p>
    </div>
  );

  const renderMiscellaneous = () => (
    <>
      <div className="summary-box space-y-4 bg-white rounded p-4 shadow">
        <h2 className="summary-title">Segment Geographic Deep Dive</h2>
        <p className="text-sm">
          {financial_analysis.segment_geographic_deep_dive}
        </p>
      </div>
      <div className="summary-box space-y-4 bg-white rounded p-4 shadow">
        <h2 className="summary-title">Deal Wins Pipeline Quality</h2>
        <p className="text-sm">
          {financial_analysis.deal_wins_pipeline_quality}
        </p>
      </div>
      <div className="summary-box space-y-4 bg-white rounded p-4 shadow">
        <h2 className="summary-title">Management Commentary Outlook</h2>
        <p className="text-sm">
          {financial_analysis.management_commentary_outlook}
        </p>
      </div>
      <div className="summary-box space-y-4 bg-white rounded p-4 shadow">
        <h2 className="summary-title">Comparison to Expectations</h2>
        <p className="text-sm">
          {financial_analysis.comparison_to_expectations}
        </p>
      </div>
      <div className="summary-box space-y-4 bg-white rounded p-4 shadow">
        <h2 className="summary-title">Key Risks Headwinds</h2>
        <p className="text-sm">{financial_analysis.key_risks_headwinds}</p>
      </div>
      <div className="summary-box space-y-4 bg-white rounded p-4 shadow">
        <h2 className="summary-title">Operational Efficiency</h2>
        <p className="text-sm">{financial_analysis.operational_efficiency}</p>
      </div>
    </>
  );

  return (
    <div>
      {renderMetadata()}
      {renderPeriodPane(
        "Quarter – Q4 FY25",
        data_extraction.latest_quarter,
        true
      )}
      {renderPeriodPane("Full Year – FY25", data_extraction.current_fy, false)}
      {renderCommentary()}
      {renderMiscellaneous()}
    </div>
  );
}

export default FinancialReport;