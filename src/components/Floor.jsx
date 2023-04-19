import React, {useRef,useEffect} from "react";

const Floor = ({  index, button, handleElevatorReservation, columns, squareRef }) => {

  //the floor left text
  const floorText = `${index === 0 ? "Ground Floor" : index === 1 ? "1st" : index === 2 ? "2nd" : index === 3 ? "3nd" : `${index}th`}`



  return (
    <div key={`row-${index}`} className="d-flex">
      <div className="row-number me-2">
       {floorText}
      </div>
      {Array.from({ length: columns }, (_, j) => (
        <div key={`cell-${index}-${j}`} className="square p-2 " ref={index === 0 && j === 0 ? squareRef : null} />
      ))}
      <button
        type="button"
        id={`button-${index}`}
        disabled={false}
        className="elevator-button-arrived"
        style={{ backgroundColor: button.color }}
        onClick={() => handleElevatorReservation(index)}
      >
        Call
      </button>
    </div>
  );
};
export default Floor
