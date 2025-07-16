export const useEventHandlers = (
  {
    tool,
    elements,
    setElements,
    setSelectedElement,
    setDragOffset,
    setIsDrawing,
    setIsDragging,
    strokeColor,
    fillColor,
    strokeWidth,
    strokeStyle,
    isDragging,
    selectedElement,
    dragOffset,
    isDrawing,
  },
  { getElementBounds, isPointInElement }
) => {
  const handleMouseDown = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (tool === "drag") {
      for (let i = elements.length - 1; i >= 0; i--) {
        if (isPointInElement(x, y, elements[i])) {
          setSelectedElement(i);
          setIsDragging(true);
          const bounds = getElementBounds(elements[i]);
          setDragOffset({ x: x - bounds.x, y: y - bounds.y });
          return;
        }
      }
    } else {
      for (let i = elements.length - 1; i >= 0; i--) {
        if (isPointInElement(x, y, elements[i])) {
          setSelectedElement(i);
          return;
        }
      }
    }

    if (tool === "drag") {
      setIsDrawing(false);
      return;
    }

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

  const handleMouseMove = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDragging && selectedElement !== null) {
      const newElements = [...elements];
      const element = newElements[selectedElement];

      switch (element.type) {
        case "rectangle":
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
        default:
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

  return { handleMouseDown, handleMouseMove, handleMouseUp };
};
