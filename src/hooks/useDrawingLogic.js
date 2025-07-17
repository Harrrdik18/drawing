export const useDrawingLogic = () => {
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

  const drawElement = (ctx, element, isSelected) => {
    ctx.save();

    ctx.strokeStyle = element.strokeColor;
    ctx.lineWidth = element.strokeWidth;

    if (element.strokeStyle === "dashed") {
      ctx.setLineDash([5, 5]);
    } else if (element.strokeStyle === "dotted") {
      ctx.setLineDash([2, 2]);
    } else {
      ctx.setLineDash([]);
    }

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
      default:
        break;
    }

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

      // Draw resize handles (corners and edges)
      const handleSize = 8;
      const half = handleSize / 2;
      const points = [
        // corners
        { x: bounds.x - 5, y: bounds.y - 5, name: "nw" },
        { x: bounds.x + bounds.width + 5, y: bounds.y - 5, name: "ne" },
        { x: bounds.x - 5, y: bounds.y + bounds.height + 5, name: "sw" },
        {
          x: bounds.x + bounds.width + 5,
          y: bounds.y + bounds.height + 5,
          name: "se",
        },
        // edges
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
      ctx.setLineDash([]);
      ctx.fillStyle = "#fff";
      ctx.strokeStyle = "#0066cc";
      points.forEach((pt) => {
        ctx.beginPath();
        ctx.rect(pt.x - half, pt.y - half, handleSize, handleSize);
        ctx.fill();
        ctx.stroke();
      });
    }

    ctx.restore();
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

  return { drawElement, getElementBounds, isPointInElement };
};
