import '../styles/floorStyles.css'
import React from "react"
import CountDownTimer from './CountTimer'
import { BUTTON_STATUS } from '../constants/constants';

function Floor ({  index, buttonStatus, handleElevatorReservation, columns, squareRef, timesData })  {

  //set the floor name
  const floorText = `${index === 0 ? "Ground Floor" : index === 1 ? "1st" : index === 2 ? "2nd" : index === 3 ? "3nd" : `${index}th`}`

    //the floor Number in text, the css class for the button and the button text.
  const {buttonClass, buttonText} = buttonStatus === BUTTON_STATUS.WAITING ? {buttonClass:"elevator-button-waiting", buttonText: 'Waiting'} : 
                                      buttonStatus === BUTTON_STATUS.CALL?{buttonClass:"elevator-button-call",buttonText: 'Call'}:
                                      buttonStatus === BUTTON_STATUS.ARRIVED?{buttonClass:"elevator-button-arrived",buttonText: 'Arrived'}:{};

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
