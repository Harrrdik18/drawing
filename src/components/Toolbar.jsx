import React from "react";
import ToolSelector from "./ToolSelector";
import PropertyControls from "./PropertyControls";
import SelectedElementControls from "./SelectedElementControls";
import ActionButtons from "./ActionButtons";

function Toolbar({
  tool,
  setTool,
  setCursor,
  strokeColor,
  setStrokeColor,
  fillColor,
  setFillColor,
  strokeWidth,
  setStrokeWidth,
  strokeStyle,
  setStrokeStyle,
  selectedElement,
  elements,
  updateSelectedElement,
  deleteSelectedElement,
  clearCanvas,
  saveDrawing,
  saveDrawingData,
  loadDrawingData,
}) {
  return (
    <div className="toolbar">
      <ToolSelector tool={tool} setTool={setTool} setCursor={setCursor} />
      <PropertyControls
        strokeColor={strokeColor}
        setStrokeColor={setStrokeColor}
        fillColor={fillColor}
        setFillColor={setFillColor}
        strokeWidth={strokeWidth}
        setStrokeWidth={setStrokeWidth}
        strokeStyle={strokeStyle}
        setStrokeStyle={setStrokeStyle}
      />
      <SelectedElementControls
        selectedElement={selectedElement}
        elements={elements}
        updateSelectedElement={updateSelectedElement}
        deleteSelectedElement={deleteSelectedElement}
      />
      <ActionButtons
        clearCanvas={clearCanvas}
        saveDrawing={saveDrawing}
        saveDrawingData={saveDrawingData}
        loadDrawingData={loadDrawingData}
      />
    </div>
  );
}

export default Toolbar;
