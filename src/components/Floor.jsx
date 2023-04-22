import React from 'react';
import PropTypes from 'prop-types';
// Styles
import '../styles/floorStyles.css';
// Contexts
import CountDownTimer from './CountTimer';
// Constants
import { BUTTON_STATUS } from '../constants/constants';

function Floor({ index, buttonStatus, handleElevatorReservation, columns, squareRef, timesData }) {
  // Set the floor name
  const floorText = `${index === 0 ? 'Ground Floor' : index === 1 ? '1st' : index === 2 ? '2nd' : index === 3 ? '3rd' : `${index}th`}`;

  // Determine the CSS class for the button and the button text based on buttonStatus
  const { buttonClass, buttonText } =
    buttonStatus === BUTTON_STATUS.WAITING
      ? { buttonClass: 'elevator-button-waiting', buttonText: 'Waiting' }
      : buttonStatus === BUTTON_STATUS.CALL
      ? { buttonClass: 'elevator-button-call', buttonText: 'Call' }
      : buttonStatus === BUTTON_STATUS.ARRIVED
      ? { buttonClass: 'elevator-button-arrived', buttonText: 'Arrived' }
      : {};

  return (
    <div id="content" key={`row-${index}`} className="floor">
      <div className="floor-number">{floorText}</div>
      <div className="floor-squares">
        {Array.from({ length: columns }, (_, j) => (
          <div key={`cell-${index}-${j}`} className="square" ref={index === 0 && j === 0 ? squareRef : null}>
            <CountDownTimer onChange={timesData[j].onChange} styles={timesData[j].styles} />
          </div>
        ))}
      </div>
      <button
        type="button"
        id={`button-${index}`}
        disabled={buttonStatus === 'waiting' || buttonStatus === 'arrived'}
        className={buttonClass}
        onClick={() => handleElevatorReservation(index)}
      >
        {buttonText}
      </button>
    </div>
  );
}

Floor.propTypes = {
  index: PropTypes.number.isRequired,
  buttonStatus: PropTypes.string.isRequired,
  handleElevatorReservation: PropTypes.func.isRequired,
  columns: PropTypes.number.isRequired,
  squareRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.any })]),
  timesData: PropTypes.arrayOf(
    PropTypes.shape({
      onChange: PropTypes.string,
      styles: PropTypes.object,
    })
  ).isRequired,
};

export default Floor;
