import React from "react";

function SelectedElementControls({
  selectedElement,
  elements,
  updateSelectedElement,
  deleteSelectedElement,
}) {
  if (selectedElement === null) return null;

  const el = elements[selectedElement];

  return (
    <div className="tool-group">
      <h3>Selected Element</h3>
      <div className="property">
        <label>Stroke Color:</label>
        <input
          type="color"
          value={el.strokeColor}
          onChange={(e) => updateSelectedElement("strokeColor", e.target.value)}
        />
      </div>
      <div className="property">
        <label>Fill Color:</label>
        <input
          type="color"
          value={el.fillColor}
          onChange={(e) => updateSelectedElement("fillColor", e.target.value)}
        />
      </div>
      <div className="property">
        <label>Stroke Width:</label>
        <input
          type="range"
          min="1"
          max="20"
          value={el.strokeWidth}
          onChange={(e) =>
            updateSelectedElement("strokeWidth", parseInt(e.target.value))
          }
        />
        <span>{el.strokeWidth}px</span>
      </div>
      <div className="property">
        <label>Stroke Style:</label>
        <select
          value={el.strokeStyle}
          onChange={(e) => updateSelectedElement("strokeStyle", e.target.value)}
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
  );
}

export default SelectedElementControls;
