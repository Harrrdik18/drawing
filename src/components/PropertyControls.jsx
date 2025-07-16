import React from "react";

function PropertyControls({
  strokeColor,
  setStrokeColor,
  fillColor,
  setFillColor,
  strokeWidth,
  setStrokeWidth,
  strokeStyle,
  setStrokeStyle,
}) {
  return (
    <div className="tool-group">
      <h3>Properties</h3>
      <div className="property">
        <label>Stroke Color:</label>
        <input
          type="color"
          value={strokeColor}
          onChange={(e) => setStrokeColor(e.target.value)}
        />
      </div>
      <div className="property">
        <label>Fill Color:</label>
        <input
          type="color"
          value={fillColor}
          onChange={(e) => setFillColor(e.target.value)}
        />
      </div>
      <div className="property">
        <label>Stroke Width:</label>
        <input
          type="range"
          min="1"
          max="20"
          value={strokeWidth}
          onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
        />
        <span>{strokeWidth}px</span>
      </div>
      <div className="property">
        <label>Stroke Style:</label>
        <select
          value={strokeStyle}
          onChange={(e) => setStrokeStyle(e.target.value)}
        >
          <option value="solid">Solid</option>
          <option value="dashed">Dashed</option>
          <option value="dotted">Dotted</option>
        </select>
      </div>
    </div>
  );
}

export default PropertyControls;
