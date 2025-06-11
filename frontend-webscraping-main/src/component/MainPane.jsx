import React from "react";
import ReportSummary from "./ReportSummary";
import './Style.css'

const MainPane = ({ selected }) => {
  if (!selected) {
    return (
      <p className="text-muted">Select any period from the left-hand menu…</p>
    );
  }

  const { company, symbol, ym, paths } = selected;
  const { reportId } = paths;
  const userId =   sessionStorage.getItem("userId");

const handleDownload = async (reportId, type) => {
  try {
    if (!reportId || !type) throw new Error("Missing reportId or type");

    const response = await fetch(
      `http://localhost:5090/api/scrapper/download?userId=${userId}&reportId=${encodeURIComponent(reportId)}&type=${type}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) throw new Error("File download failed");

    const disposition = response.headers.get("Content-Disposition") || "";
    console.log(disposition);
    let filename = "downloaded_file";

    // Try extracting from filename*
    const filenameStarMatch = disposition.match(/filename\*=UTF-8''([^;\n]+)/);
    console.log(filenameStarMatch);
    if (filenameStarMatch && filenameStarMatch[1]) {
      filename = decodeURIComponent(filenameStarMatch[1]);
    } else {
      // Fallback to filename=
      const filenameMatch = disposition.match(/filename="?([^"]+)"?/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1];
      }
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download failed:", error);
  }
};



  return (
    <main className="summary-box space-y-4 bg-grey rounded p-4 shadow">
      <h2 className="main-title">
        {company} — {ym.replace("_", " / ")}
      </h2>
      <div className="download-links">
        <button
          onClick={() => handleDownload(reportId, "ppt")}
          className="btn blue"
        >
          Download PPT
        </button>
        <button
          onClick={() => handleDownload(reportId, "transcript")}
          className="btn green"
        >
          Download Transcript
        </button>
      </div>
      <ReportSummary reportId={reportId} />
    </main>
  );
};

export default MainPane;
