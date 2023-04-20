import '../styles/floorStyles.css'
import React from "react"
import CountDownTimer from './CountTimer'

const Floor = ({  index, buttonStatus, handleElevatorReservation, columns, squareRef, timesData }) => {

  //the floor left text
  const floorText = `${index === 0 ? "Ground Floor" : index === 1 ? "1st" : index === 2 ? "2nd" : index === 3 ? "3nd" : `${index}th`}`
  const {buttonClass, buttonText} = buttonStatus === 'waiting' ? {buttonClass:"elevator-button-waiting", buttonText: 'Waiting'} : 
                                      buttonStatus === 'call'?{buttonClass:"elevator-button-call",buttonText: 'Call'}:
                                      buttonStatus === 'arrived'?{buttonClass:"elevator-button-arrived",buttonText: 'Arrived'}:{};





  return (
    <div key={`row-${index}`} className="floor">
      <div className="floor-number">
       {floorText}
      </div>
      <div className="floor-squares">
        {Array.from({ length: columns }, (_, j) => (
          <div key={`cell-${index}-${j}`} className="square " ref={index === 0 && j === 0 ? squareRef : null}>
            <CountDownTimer 
            onChange={timesData[j].onChange} 
            styles = {timesData[j].styles}
            />
          </div>
        ))}
      </div>
      <button
        type="button"
        id={`button-${index}`}
        disabled={buttonStatus === 'waiting' || buttonStatus === 'arrived'}
        className= {buttonClass}
        onClick={() => handleElevatorReservation(index)}
      >
        {buttonText}
      </button>
   
    </div>
  );
};
export default Floor
