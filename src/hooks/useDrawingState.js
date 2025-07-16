import { useState } from "react";

export const useDrawingState = () => {
  const [tool, setTool] = useState("rectangle");
  const [isDrawing, setIsDrawing] = useState(false);
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [fillColor, setFillColor] = useState("#ffffff");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [strokeStyle, setStrokeStyle] = useState("solid");
  const [cursor, setCursor] = useState("crosshair");

  return {
    tool,
    cursor,
    setCursor,
    setTool,
    isDrawing,
    setIsDrawing,
    elements,
    setElements,
    selectedElement,
    setSelectedElement,
    dragOffset,
    setDragOffset,
    isDragging,
    setIsDragging,
    strokeColor,
    setStrokeColor,
    fillColor,
    setFillColor,
    strokeWidth,
    setStrokeWidth,
    strokeStyle,
    setStrokeStyle,
  };
};
