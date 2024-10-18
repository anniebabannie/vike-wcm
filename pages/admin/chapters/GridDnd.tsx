import React from "react";
import GridLayout from "react-grid-layout";
import '/node_modules/react-grid-layout/css/styles.css';
const MyFirstGrid = () => {
  // Define the layout as a constant
  const layout = [
    { i: "a", x: 0, y: 1, w: 1, h: 1, isDraggable: true, isResizable: false, isBounded: true },
    { i: "b", x: 1, y: 1, w: 1, h: 1, isDraggable: true, isResizable: false, isBounded: true },
    { i: "c", x: 2, y: 1, w: 1, h: 1, isDraggable: true, isResizable: false, isBounded: true },
    { i: "d", x: 3, y: 1, w: 1, h: 1, isDraggable: true, isResizable: false, isBounded: true },
    { i: "e", x: 4, y: 1, w: 1, h: 1, isDraggable: true, isResizable: false, isBounded: true },
    { i: "f", x: 5, y: 1, w: 1, h: 1, isDraggable: true, isResizable: false, isBounded: true },
    { i: "g", x: 6, y: 1, w: 1, h: 1, isDraggable: true, isResizable: false, isBounded: true },
  ];

  return (
    <GridLayout
      className="layout"
      layout={layout}
      cols={3}
      rowHeight={60}
      width={600}
    >
      <div key="a" className="bg-gray-100 rounded-md flex items-center justify-center select-none">a</div>
      <div key="b" className="bg-gray-100 rounded-md flex items-center justify-center select-none">b</div>
      <div key="c" className="bg-gray-100 rounded-md flex items-center justify-center select-none">c</div>
      <div key="d" className="bg-gray-100 rounded-md flex items-center justify-center select-none">d</div>
      <div key="e" className="bg-gray-100 rounded-md flex items-center justify-center select-none">e</div>
      <div key="f" className="bg-gray-100 rounded-md flex items-center justify-center select-none">f</div>
      <div key="g" className="bg-gray-100 rounded-md flex items-center justify-center select-none">g</div>
    </GridLayout>
  );
};

export default MyFirstGrid;
