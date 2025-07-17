export const useEventHandlers = (
  {
    tool,
    elements,
    setElements,
    setSelectedElement,
    setDragOffset,
    setIsDrawing,
    setIsDragging,
    isResizing,
    setIsResizing,
    resizeHandle,
    setResizeHandle,
    strokeColor,
    fillColor,
    strokeWidth,
    strokeStyle,
    isDragging,
    selectedElement,
    dragOffset,
    isDrawing,
    setTool, // <-- Added setTool
    setCursor, // <-- Added setCursor
  },
  { getElementBounds, isPointInElement }
) => {
  // Helper: hit-test for resize handles
  const getHandleAtPoint = (x, y, element, handleSize = 18) => {
    if (!element) return null;
    const bounds = getElementBounds(element);
    const half = handleSize / 2;
    const points = [
      { x: bounds.x - 5, y: bounds.y - 5, name: "nw" },
      { x: bounds.x + bounds.width + 5, y: bounds.y - 5, name: "ne" },
      { x: bounds.x - 5, y: bounds.y + bounds.height + 5, name: "sw" },
      {
        x: bounds.x + bounds.width + 5,
        y: bounds.y + bounds.height + 5,
        name: "se",
      },
      { x: bounds.x + bounds.width / 2, y: bounds.y - 5, name: "n" },
      {
        x: bounds.x + bounds.width / 2,
        y: bounds.y + bounds.height + 5,
        name: "s",
      },
      { x: bounds.x - 5, y: bounds.y + bounds.height / 2, name: "w" },
      {
        x: bounds.x + bounds.width + 5,
        y: bounds.y + bounds.height / 2,
        name: "e",
      },
    ];
    for (let pt of points) {
      if (
        x >= pt.x - half &&
        x <= pt.x + half &&
        y >= pt.y - half &&
        y <= pt.y + half
      ) {
        return pt.name;
      }
    }
    return null;
  };

  const handleMouseDown = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check for resize handle hit
    if (selectedElement !== null && tool === "drag") {
      const handle = getHandleAtPoint(x, y, elements[selectedElement]);
      if (handle) {
        setIsResizing(true);
        setResizeHandle(handle);
        return;
      }
    }

    if (tool === "drag") {
      for (let i = elements.length - 1; i >= 0; i--) {
        if (isPointInElement(x, y, elements[i])) {
          setSelectedElement(i);
          setIsDragging(true);
          const element = elements[i];
          if (element.type === "line") {
            // For lines, use offset from the first point (x1, y1)
            setDragOffset({ x: x - element.x1, y: y - element.y1 });
          } else {
            const bounds = getElementBounds(element);
            setDragOffset({ x: x - bounds.x, y: y - bounds.y });
          }
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
      newElement.cx = x; // center x
      newElement.cy = y; // center y
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

    if (isResizing && selectedElement !== null && resizeHandle) {
      const newElements = [...elements];
      const element = newElements[selectedElement];
      const bounds = getElementBounds(element);
      let minSize = 10; // Minimum size for width/height/radius

      if (element.type === "rectangle") {
        let newX = element.x;
        let newY = element.y;
        let newWidth = element.width;
        let newHeight = element.height;

        switch (resizeHandle) {
          case "nw":
            newWidth = element.width + (element.x - x);
            newHeight = element.height + (element.y - y);
            newX = x;
            newY = y;
            break;
          case "ne":
            newWidth = x - element.x;
            newHeight = element.height + (element.y - y);
            newY = y;
            break;
          case "sw":
            newWidth = element.width + (element.x - x);
            newX = x;
            newHeight = y - element.y;
            break;
          case "se":
            newWidth = x - element.x;
            newHeight = y - element.y;
            break;
          case "n":
            newHeight = element.height + (element.y - y);
            newY = y;
            break;
          case "s":
            newHeight = y - element.y;
            break;
          case "w":
            newWidth = element.width + (element.x - x);
            newX = x;
            break;
          case "e":
            newWidth = x - element.x;
            break;
          default:
            break;
        }
        // Clamp to minimum size
        if (newWidth < minSize) {
          newX =
            element.x +
            (element.width - minSize) * (resizeHandle.includes("w") ? 1 : 0);
          newWidth = minSize;
        }
        if (newHeight < minSize) {
          newY =
            element.y +
            (element.height - minSize) * (resizeHandle.includes("n") ? 1 : 0);
          newHeight = minSize;
        }
        element.x = newX;
        element.y = newY;
        element.width = newWidth;
        element.height = newHeight;
      } else if (element.type === "circle") {
        // Resize circle by changing radius based on handle
        let centerX = element.cx;
        let centerY = element.cy;
        let dx = x - centerX;
        let dy = y - centerY;
        let newRadius = Math.max(Math.abs(dx), Math.abs(dy));
        if (newRadius < minSize / 2) newRadius = minSize / 2;
        element.radius = newRadius;
        // Center coordinates remain the same
        element.cx = centerX;
        element.cy = centerY;
      } else if (element.type === "line") {
        // Allow resizing line endpoints
        switch (resizeHandle) {
          case "nw":
          case "sw":
          case "w":
            element.x1 = x;
            element.y1 = y;
            break;
          case "ne":
          case "se":
          case "e":
            element.x2 = x;
            element.y2 = y;
            break;
          default:
            break;
        }
      }
      setElements(newElements);
    } else if (isDragging && selectedElement !== null) {
      const newElements = [...elements];
      const element = newElements[selectedElement];

      switch (element.type) {
        case "rectangle":
          element.x = x - dragOffset.x;
          element.y = y - dragOffset.y;
          break;
        case "circle":
          element.cx = x - dragOffset.x + element.radius;
          element.cy = y - dragOffset.y + element.radius;
          break;
        case "line":
          const newX1 = x - dragOffset.x;
          const newY1 = y - dragOffset.y;
          const deltaX = newX1 - element.x1;
          const deltaY = newY1 - element.y1;
          element.x1 = newX1;
          element.y1 = newY1;
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
          (x - currentElement.cx) ** 2 + (y - currentElement.cy) ** 2
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
    setIsResizing(false);
    setResizeHandle(null);
    // Reset tool to "drag" after creating a shape
    if (tool === "rectangle" || tool === "circle" || tool === "line") {
      setTool("drag");
      setCursor("default");
    }
  };

  return { handleMouseDown, handleMouseMove, handleMouseUp };
};
