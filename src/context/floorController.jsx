import React, { createContext, useContext, useState } from 'react';
import { BUTTON_STATUS } from '../constants/constants';
import { TIMER } from '../constants/constants';
import Floor from '../components/Floor';
import { useElevatorController } from './elevatorController';

const FloorControllerContext = createContext();

export const useFloorController = () => {
  return useContext(FloorControllerContext);
};


const FloorControllerProvider = ({ children, columns, rows }) => {
  const {squareRef} = useElevatorController()
  const [floorsData, setFloorsData] = useState(createFloorsData())

  function createFloorsData() {
    const ans = [];
    for (let i = 0; i < rows; i++) {
      const timesArr = new Array(columns).fill(TIMER.STOP); 
      ans.push({
        key: `floor-${i}`,
        index: rows - i - 1,
        buttonStatus: BUTTON_STATUS.CALL,
        timeArr: timesArr
      });
    }
    return ans;
  }

  /**
   * Hides or turns off the hours in the slot
   * @param {number} floorIndex - Row number
   * @param {number} elevatorIndex - Column number
   * @param {string, opacity} param2 - the action on the time in the square (show/hide)
   */
  function handleClockAction(floorIndex, elevatorIndex, { onChange: action, styles: newStyles }){
    //help function inside a function, set the square time
    function setTime(timersArr) {
      return timersArr.map((timer, i) => {
        if (i === elevatorIndex) {
          return {
            ...timer,
            onChange: action,
            styles: newStyles
          };
        } else {
          return timer;
        }
      });
    }

    //set the flloor data to change the clocks
    setFloorsData(prevData =>
        prevData.map(floorData =>
          {
            const newData = floorData.index === floorIndex? {
              ...floorData, 
              timeArr: setTime(floorData.timeArr)
            }:floorData 
            if(floorData.index === floorIndex){
            }
            return newData
          }
      ))
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

export default FloorControllerProvider;
