import { useState } from "react";
import HousingDetails from "./HousingDetails";
import ReportPage from "./ReportPage";

const Housing = () => {
  const [activeTab, setActiveTab] = useState("houseDetails");

  const renderContent = () => {
    // A switch case logic to render different content page for different state
    switch (activeTab) {
      case "houseDetails":
        return <HousingDetails />;
      case "facilityReport":
        return <ReportPage />;
      default:
        return <HousingDetails />;
    }
  };

  return (
    <div>
      <h1>Housing</h1>
      <div>
        <button onClick={() => setActiveTab("houseDetails")}>
          House Details
        </button>
        <button onClick={() => setActiveTab("facilityReport")}>
          Facility Report
        </button>
      </div>
      <div>{renderContent()}</div>
    </div>
  );
};

export default Housing;
