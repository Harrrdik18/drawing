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
      // Only show tiny dots of stroke color at vertices for resizing
      ctx.setLineDash([]);
      ctx.lineWidth = 1;
      ctx.fillStyle = element.strokeColor;
      let dotRadius = 5;

      if (element.type === "rectangle" || element.type === "circle") {
        let bounds = getElementBounds(element);
        // 4 corners
        const points = [
          { x: bounds.x, y: bounds.y }, // top-left
          { x: bounds.x + bounds.width, y: bounds.y }, // top-right
          { x: bounds.x, y: bounds.y + bounds.height }, // bottom-left
          { x: bounds.x + bounds.width, y: bounds.y + bounds.height }, // bottom-right
        ];
        points.forEach((pt) => {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, dotRadius, 0, 2 * Math.PI);
          ctx.fill();
        });
      } else if (element.type === "line") {
        // Endpoints
        const points = [
          { x: element.x1, y: element.y1 },
          { x: element.x2, y: element.y2 },
        ];
        points.forEach((pt) => {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, dotRadius, 0, 2 * Math.PI);
          ctx.fill();
        });
      }
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
