import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
// Constants
import { BUTTON_STATUS } from '../constants/constants';
import { TIMER } from '../constants/constants';
// Conponents
import Floor from '../components/Floor';
// Contexts
import { useElevatorController } from './elevatorController';

const FloorControllerContext = createContext();

// The useFloorController function is a custom hook that provides access to the floor controller context.
export const useFloorController = (data) => {
  const context =  useContext(FloorControllerContext);
  return { ...context, ...data };
};

// The FloorControllerProvider component is a context provider that manages floor-related state and actions.
const FloorControllerProvider = ({ children, columns, rows, data }) => {
  const {squareRef} = useElevatorController()
  const [floorsData, setFloorsData] = useState(createFloorsData())

  function createFloorsData() {
    return Array.from({ length: rows }, (_, i) => {
      const timesArr = new Array(columns).fill(TIMER.STOP);
      return {
        key: `floor-${i}`,
        index: rows - i - 1,
        buttonStatus: BUTTON_STATUS.CALL,
        timeArr: timesArr
      };
    });
  }
  /**
   * Hides or turns off the hours in the slot
   * @param {number} floorIndex - Row number
   * @param {number} elevatorIndex - Column number
   * @param {string, opacity} param2 - the action on the time in the square (show/hide)
   */
  function handleClockAction(floorIndex, elevatorIndex, { onChange: action, styles: newStyles }) {
    setFloorsData(prevData =>
      prevData.map(floorData => {
        if (floorData.index === floorIndex) {
          const updatedTimeArr = floorData.timeArr.map((timer, i) => {
            if (i === elevatorIndex) {
              return {
                ...timer,
                onChange: action,
                styles: newStyles
              };
            }
            return timer;
          });
          return { ...floorData, timeArr: updatedTimeArr };
        }
        return floorData;
      })
    );
  }
  

  /**
   * 
   * @param {function} handleButtonClick - Function that handle's an elevator call 
   * @returns the elevators HTML code
   */
  function createFloors(handleButtonClick) {
    return floorsData.map((floorData) => (
      <Floor
        columns={columns}
        squareRef={squareRef}
        key={floorData.key}
        index={floorData.index}
        buttonStatus={floorData.buttonStatus}
        handleElevatorReservation={handleButtonClick}
        timesData = {floorData.timeArr}
      />
    ));
  };
  
  /**
   * 
   * @param {number} floorIndex - The button at the floor
   * @param {number} newStatus - To handle the new style of the button
   */    
  function setButtonStatus(floorIndex, newStatus){
    setFloorsData(prevData =>
    prevData.map(floorData => floorData.index === floorIndex?{...floorData, buttonStatus: newStatus}:floorData))
  }



  const value = {
                  createFloorsData,
                  setFloorsData,
                  floorsData,
                  setButtonStatus,
                  handleClockAction,
                  createFloors
                }


  return (
    <FloorControllerContext.Provider value={value}>
      {children}
    </FloorControllerContext.Provider>
  );
};
FloorControllerProvider.propTypes = {
  children: PropTypes.node.isRequired,
  columns: PropTypes.number.isRequired,
  rows: PropTypes.number.isRequired,
  data: PropTypes.array // Add a more specific shape if needed
};

export default FloorControllerProvider;
