import React, { useRef, useEffect } from "react";

function Canvas({
  elements,
  selectedElement,
  drawElement,
  getElementBounds,
  isPointInElement,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  cursor = "crosshair",
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    elements.forEach((element, index) => {
      drawElement(ctx, element, index === selectedElement);
    });
  }, [elements, selectedElement, drawElement]);

  return (
    <div className="canvas-container">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{ cursor }}
        onMouseDown={(e) => handleMouseDown(e, canvasRef.current)}
        onMouseMove={(e) => handleMouseMove(e, canvasRef.current)}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
}

export default Canvas;
