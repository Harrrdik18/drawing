import React from "react";

function Toolbar({
  tool,
  setTool,
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
      <div className="tool-group">
        <h3>Tools</h3>
        <button
          className={tool === "rectangle" ? "active" : ""}
          onClick={() => setTool("rectangle")}
        >
          Rectangle
        </button>
        <button
          className={tool === "circle" ? "active" : ""}
          onClick={() => setTool("circle")}
        >
          Circle
        </button>
        <button
          className={tool === "line" ? "active" : ""}
          onClick={() => setTool("line")}
        >
          Line
        </button>
      </div>

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

      {selectedElement !== null && (
        <div className="tool-group">
          <h3>Selected Element</h3>
          <div className="property">
            <label>Stroke Color:</label>
            <input
              type="color"
              value={elements[selectedElement].strokeColor}
              onChange={(e) =>
                updateSelectedElement("strokeColor", e.target.value)
              }
            />
          </div>
          <div className="property">
            <label>Fill Color:</label>
            <input
              type="color"
              value={elements[selectedElement].fillColor}
              onChange={(e) =>
                updateSelectedElement("fillColor", e.target.value)
              }
            />
          </div>
          <div className="property">
            <label>Stroke Width:</label>
            <input
              type="range"
              min="1"
              max="20"
              value={elements[selectedElement].strokeWidth}
              onChange={(e) =>
                updateSelectedElement("strokeWidth", parseInt(e.target.value))
              }
            />
            <span>{elements[selectedElement].strokeWidth}px</span>
          </div>
          <div className="property">
            <label>Stroke Style:</label>
            <select
              value={elements[selectedElement].strokeStyle}
              onChange={(e) =>
                updateSelectedElement("strokeStyle", e.target.value)
              }
            >
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
            </select>
          </div>
          <button onClick={deleteSelectedElement} className="delete-btn">
            Delete Element
          </button>
        </div>
      )}

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
    </div>
  );
}

export default Toolbar;
