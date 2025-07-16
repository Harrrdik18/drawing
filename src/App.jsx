import { useState, useRef, useEffect } from "react";
import "./App.css";

function App() {
  const canvasRef = useRef(null);
  const [tool, setTool] = useState("rectangle");
  const [isDrawing, setIsDrawing] = useState(false);
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  // Drawing properties
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [fillColor, setFillColor] = useState("#ffffff");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [strokeStyle, setStrokeStyle] = useState("solid");

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all elements
    elements.forEach((element, index) => {
      drawElement(ctx, element, index === selectedElement);
    });
  }, [elements, selectedElement]);

  const drawElement = (ctx, element, isSelected) => {
    ctx.save();

    // Set stroke properties
    ctx.strokeStyle = element.strokeColor;
    ctx.lineWidth = element.strokeWidth;

    // Set line dash pattern
    if (element.strokeStyle === "dashed") {
      ctx.setLineDash([5, 5]);
    } else if (element.strokeStyle === "dotted") {
      ctx.setLineDash([2, 2]);
    } else {
      ctx.setLineDash([]);
    }

    // Set fill color
    ctx.fillStyle = element.fillColor;

    switch (element.type) {
      case "rectangle":
        ctx.fillRect(element.x, element.y, element.width, element.height);
        ctx.strokeRect(element.x, element.y, element.width, element.height);
        break;
      case "circle":
        ctx.beginPath();
        ctx.arc(
          element.x + element.radius,
          element.y + element.radius,
          element.radius,
          0,
          2 * Math.PI
        );
        ctx.fill();
        ctx.stroke();
        break;
      case "line":
        ctx.beginPath();
        ctx.moveTo(element.x1, element.y1);
        ctx.lineTo(element.x2, element.y2);
        ctx.stroke();
        break;
    }

    // Draw selection indicator
    if (isSelected) {
      ctx.strokeStyle = "#0066cc";
      ctx.lineWidth = 2;
      ctx.setLineDash([3, 3]);

      let bounds = getElementBounds(element);
      ctx.strokeRect(
        bounds.x - 5,
        bounds.y - 5,
        bounds.width + 10,
        bounds.height + 10
      );
    }

    ctx.restore();
  };

  const getElementBounds = (element) => {
    switch (element.type) {
      case "rectangle":
        return {
          x: element.x,
          y: element.y,
          width: element.width,
          height: element.height,
        };
      case "circle":
        return {
          x: element.x,
          y: element.y,
          width: element.radius * 2,
          height: element.radius * 2,
        };
      case "line":
        return {
          x: Math.min(element.x1, element.x2),
          y: Math.min(element.y1, element.y2),
          width: Math.abs(element.x2 - element.x1),
          height: Math.abs(element.y2 - element.y1),
        };
      default:
        return { x: 0, y: 0, width: 0, height: 0 };
    }
  };

  const isPointInElement = (x, y, element) => {
    const bounds = getElementBounds(element);

    switch (element.type) {
      case "rectangle":
        return (
          x >= bounds.x &&
          x <= bounds.x + bounds.width &&
          y >= bounds.y &&
          y <= bounds.y + bounds.height
        );
      case "circle":
        const centerX = element.x + element.radius;
        const centerY = element.y + element.radius;
        const circleDistance = Math.sqrt(
          (x - centerX) ** 2 + (y - centerY) ** 2
        );
        return circleDistance <= element.radius;
      case "line":
        // Simple line hit detection (within 5 pixels of line)
        const A = element.y2 - element.y1;
        const B = element.x1 - element.x2;
        const C = element.x2 * element.y1 - element.x1 * element.y2;
        const lineDistance =
          Math.abs(A * x + B * y + C) / Math.sqrt(A * A + B * B);
        return (
          lineDistance <= 5 &&
          x >= Math.min(element.x1, element.x2) - 5 &&
          x <= Math.max(element.x1, element.x2) + 5 &&
          y >= Math.min(element.y1, element.y2) - 5 &&
          y <= Math.max(element.y1, element.y2) + 5
        );
      default:
        return false;
    }
  };

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicking on existing element
    for (let i = elements.length - 1; i >= 0; i--) {
      if (isPointInElement(x, y, elements[i])) {
        setSelectedElement(i);
        setIsDragging(true);

        const bounds = getElementBounds(elements[i]);
        setDragOffset({
          x: x - bounds.x,
          y: y - bounds.y,
        });
        return;
      }
    }

    // Start drawing new element
    setSelectedElement(null);
    setIsDrawing(true);

    const newElement = {
      strokeColor,
      fillColor,
      strokeWidth,
      strokeStyle,
    };

    if (tool === "rectangle") {
      newElement.type = "rectangle";
      newElement.x = x;
      newElement.y = y;
      newElement.width = 0;
      newElement.height = 0;
    } else if (tool === "circle") {
      newElement.type = "circle";
      newElement.x = x;
      newElement.y = y;
      newElement.radius = 0;
    } else if (tool === "line") {
      newElement.type = "line";
      newElement.x1 = x;
      newElement.y1 = y;
      newElement.x2 = x;
      newElement.y2 = y;
    }

    setElements([...elements, newElement]);
  };

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDragging && selectedElement !== null) {
      const newElements = [...elements];
      const element = newElements[selectedElement];

      switch (element.type) {
        case "rectangle":
          element.x = x - dragOffset.x;
          element.y = y - dragOffset.y;
          break;
        case "circle":
          element.x = x - dragOffset.x;
          element.y = y - dragOffset.y;
          break;
        case "line":
          const deltaX = x - dragOffset.x - element.x1;
          const deltaY = y - dragOffset.y - element.y1;
          element.x1 += deltaX;
          element.y1 += deltaY;
          element.x2 += deltaX;
          element.y2 += deltaY;
          break;
      }

      setElements(newElements);
    } else if (isDrawing) {
      const newElements = [...elements];
      const currentElement = newElements[newElements.length - 1];

      if (tool === "rectangle") {
        currentElement.width = x - currentElement.x;
        currentElement.height = y - currentElement.y;
      } else if (tool === "circle") {
        const radius = Math.sqrt(
          (x - currentElement.x) ** 2 + (y - currentElement.y) ** 2
        );
        currentElement.radius = radius;
      } else if (tool === "line") {
        currentElement.x2 = x;
        currentElement.y2 = y;
      }

      setElements(newElements);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setIsDragging(false);
  };

  const updateSelectedElement = (property, value) => {
    if (selectedElement !== null) {
      const newElements = [...elements];
      newElements[selectedElement][property] = value;
      setElements(newElements);
    }
  };

  const deleteSelectedElement = () => {
    if (selectedElement !== null) {
      const newElements = elements.filter(
        (_, index) => index !== selectedElement
      );
      setElements(newElements);
      setSelectedElement(null);
    }
  };

  const clearCanvas = () => {
    setElements([]);
    setSelectedElement(null);
  };

  const saveDrawing = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "drawing.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  const saveDrawingData = () => {
    const dataStr = JSON.stringify(elements, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "drawing-data.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const loadDrawingData = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          setElements(data);
          setSelectedElement(null);
        } catch (error) {
          alert("Error loading file: Invalid format");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="app">
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

      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>
    </div>
  );
}

export default App;
