import React ,{useEffect, useState}from 'react'
import './Style.css'
import FinancialAnalysisSection from './FinancialAnalysisSection';

const DataExteactionSection = ({ data , finData}) => {

    const [activeTab,setActiveTab] = useState(null);

    const periodEntries = Object.entries(data || {});
    useEffect(() =>{
        if (!activeTab && periodEntries.length > 0){
        setActiveTab( periodEntries[0][0]);
    }
    },[data]);
    
    const data_extraction = data;
    return (
        <>
            <div className="tab-buttons">
                {periodEntries.map(([periodKey,periodData]) => (
                    <button
                            key={periodKey}
                            className={`tab-btn ${activeTab === periodKey ? 'active' : ''}`}
                            onClick={() => setActiveTab(periodKey)}>
                        {periodData.period_label || periodKey}
                    </button>
                ))}
                <button 
                 className={`tab-btn ${activeTab === 'summary' ? 'active' : ''}`}
                 onClick={() => setActiveTab('summary')}>
                    Summary
                </button>
            </div>
            <div className="tab-panel-wrapper">
                {periodEntries.map(([periodKey, periodData]) => (
                activeTab === periodKey && (
                <div key={periodKey} className="section">
                    <h3>{periodData.period_label || periodKey}</h3>

                    {/* Revenue */}
                    {periodData.revenue && (
                        <div>
                            <h4>Revenue</h4>
                            <table>
                                <tbody>
                                    <tr>
                                        <td><strong>Total INR</strong></td>
                                        <td>₹ {periodData.revenue.total_inr ?? 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Total USD</strong></td>
                                        <td>$ {periodData.revenue.total_usd ?? 'N/A'}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Segment Performance */}
                    {Array.isArray(periodData.segment_performance) && (
                        <div>
                            <h4>Segment Performance</h4>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Segment</th>
                                        <th>Revenue (INR Cr)</th>
                                        <th>Growth %</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {periodData.segment_performance.map((segment, i) => (
                                        <tr key={i}>
                                            <td>{segment.segment}</td>
                                            <td>₹ {segment.revenue_inr}</td>
                                            <td>{segment.growth_pct_qoq ?? segment.growth_pct_yoy ?? 'N/A'}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Geographic Performance */}
                    {Array.isArray(periodData.geographic_performance) && (
                        <div>
                            <h4>Geographic Performance</h4>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Region</th>
                                        <th>Growth %</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {periodData.geographic_performance.map((geo, i) => (
                                        <tr key={i}>
                                            <td>{geo.region}</td>
                                            <td>{geo.growth_pct_qoq ?? geo.growth_pct_yoy ?? 'N/A'}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Profitability */}
                    {periodData.profitability && (
                        <div>
                            <h4>Profitability</h4>
                            <table>
                                <tbody>
                                    <tr>
                                        <td><strong>EBIT</strong></td>
                                        <td>₹ {periodData.profitability.ebit_inr} Cr</td>
                                    </tr>
                                    <tr>
                                        <td><strong>EBIT Margin</strong></td>
                                        <td>{periodData.profitability.ebit_margin_pct}%</td>
                                    </tr>
                                    <tr>
                                        <td><strong>PAT</strong></td>
                                        <td>₹ {periodData.profitability.pat_inr} Cr</td>
                                    </tr>
                                    <tr>
                                        <td><strong>PAT Margin</strong></td>
                                        <td>{periodData.profitability.pat_margin_pct}%</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Headcount */}
                    {periodData.headcount_metrics && (
                        <div>
                            <h4>Headcount</h4>
                            <table>
                                <tbody>
                                    <tr>
                                        <td><strong>Total Headcount</strong></td>
                                        <td>{periodData.headcount_metrics.total_headcount}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Attrition % (TTM)</strong></td>
                                        <td>{periodData.headcount_metrics.attrition_pct_ttm}%</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Utilization %</strong></td>
                                        <td>{periodData.headcount_metrics.utilization_excl_trainees_pct}%</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Dividend */}
                    {periodData.dividend && (
                        <div>
                            <h4>Dividend</h4>
                            <table>
                                <tbody>
                                    <tr>
                                        <td><strong>Dividend per Share</strong></td>
                                        <td>
                                            ₹{periodData.dividend.final_dividend_per_share_inr ??
                                                periodData.dividend.total_dividend_per_share_inr ??
                                                'N/A'}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                )
            ))}
            {activeTab === 'summary' && (
          <div className="section">
            <FinancialAnalysisSection data={finData} />
          </div>
        )}
            </div>
            
        </>
    )
}

export default DataExteactionSection