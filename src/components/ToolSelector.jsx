import React from "react";

const RectangleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
  </svg>
);

const CircleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"></circle>
  </svg>
);

const LineIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="19" x2="19" y2="5"></line>
  </svg>
);

const DragIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="5 9 2 12 5 15"></polyline>
    <polyline points="9 5 12 2 15 5"></polyline>
    <polyline points="15 19 12 22 9 19"></polyline>
    <polyline points="19 9 22 12 19 15"></polyline>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <line x1="12" y1="2" x2="12" y2="22"></line>
  </svg>
);

function ToolSelector({ tool, setTool, setCursor }) {
  const handleToolChange = (newTool) => {
    setTool(newTool);
    if (newTool === "drag") {
      setCursor("default");
    } else {
      setCursor("crosshair");
    }
  };

  return (
    <div className="tool-group">
      <h3>Tools</h3>
      <button
        className={tool === "rectangle" ? "active" : ""}
        onClick={() => handleToolChange("rectangle")}
        title="Rectangle"
      >
        <RectangleIcon />
      </button>
      <button
        className={tool === "circle" ? "active" : ""}
        onClick={() => handleToolChange("circle")}
        title="Circle"
      >
        <CircleIcon />
      </button>
      <button
        className={tool === "line" ? "active" : ""}
        onClick={() => handleToolChange("line")}
        title="Line"
      >
        <LineIcon />
      </button>
      <button
        className={tool === "drag" ? "active" : ""}
        onClick={() => handleToolChange("drag")}
        title="Drag"
      >
        <DragIcon />
      </button>
    </div>
  );
}

export default ToolSelector;
