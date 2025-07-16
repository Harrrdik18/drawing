export const useFileActions = ({
  elements,
  setElements,
  selectedElement,
  setSelectedElement,
}) => {
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
    const canvas = document.querySelector("canvas");
    if (canvas) {
      const link = document.createElement("a");
      link.download = "drawing.png";
      link.href = canvas.toDataURL();
      link.click();
    }
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

  return {
    updateSelectedElement,
    deleteSelectedElement,
    clearCanvas,
    saveDrawing,
    saveDrawingData,
    loadDrawingData,
  };
};
