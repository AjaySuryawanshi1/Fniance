import React from 'react'
import './Style.css'

const MetadataSection = ({data}) => {

    const metadata= data;
  return (
    <>
    <div className="summary-box">
            <div className="summary-list">
                <h2>Company: {metadata.company}</h2>
                <p><strong>Report Generated On:</strong> {metadata.report_generated_on}</p>
            </div>
</div>

            <h3>Source Documents</h3>
            <div className="section">
                <ul>
                    {metadata.source_documents.map((doc, i) => (
                        <li key={i}>
                            <strong>{doc.type}</strong> — {doc.period_covered} ({doc.file_name})
                        </li>
                    ))}
                </ul>
            </div>
    </>
  )
}

export default MetadataSection