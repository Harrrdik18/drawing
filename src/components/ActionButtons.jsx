import React from "react";

function ActionButtons({
  clearCanvas,
  saveDrawing,
  saveDrawingData,
  loadDrawingData,
}) {
  return (
    <div className="tool-group">
      <h3>Actions</h3>
      <button onClick={clearCanvas}>Clear Canvas</button>
      <button onClick={saveDrawing}>Save as Image</button>
      <button onClick={saveDrawingData}>Save Drawing Data</button>
      <div className="file-input-wrapper">
        <input
          type="file"
          accept=".json"
          onChange={loadDrawingData}
          id="load-file"
        />
        <label htmlFor="load-file">Load Drawing Data</label>
      </div>
    </div>
  );
}

export default ActionButtons;
