import React from "react";
import "./App.css";
import Toolbar from "./components/Toolbar";
import Canvas from "./components/Canvas";
import { useDrawingState } from "./hooks/useDrawingState";
import { useDrawingLogic } from "./hooks/useDrawingLogic";
import { useEventHandlers } from "./hooks/useEventHandlers";
import { useFileActions } from "./hooks/useFileActions";

function App() {
  const state = useDrawingState();
  const logic = useDrawingLogic();
  const events = useEventHandlers(state, logic);
  const actions = useFileActions(state);

  return (
    <div className="app">
      <Toolbar
        tool={state.tool}
        setTool={state.setTool}
        setCursor={state.setCursor}
        strokeColor={state.strokeColor}
        setStrokeColor={state.setStrokeColor}
        fillColor={state.fillColor}
        setFillColor={state.setFillColor}
        strokeWidth={state.strokeWidth}
        setStrokeWidth={state.setStrokeWidth}
        strokeStyle={state.strokeStyle}
        setStrokeStyle={state.setStrokeStyle}
        selectedElement={state.selectedElement}
        elements={state.elements}
        updateSelectedElement={actions.updateSelectedElement}
        deleteSelectedElement={actions.deleteSelectedElement}
        clearCanvas={actions.clearCanvas}
        saveDrawing={actions.saveDrawing}
        saveDrawingData={actions.saveDrawingData}
        loadDrawingData={actions.loadDrawingData}
      />
      <Canvas
        elements={state.elements}
        selectedElement={state.selectedElement}
        drawElement={logic.drawElement}
        getElementBounds={logic.getElementBounds}
        isPointInElement={logic.isPointInElement}
        handleMouseDown={events.handleMouseDown}
        handleMouseMove={events.handleMouseMove}
        handleMouseUp={events.handleMouseUp}
        cursor={state.cursor}
      />
    </div>
  );
}

export default App;
