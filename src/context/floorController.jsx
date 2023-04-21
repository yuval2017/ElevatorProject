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

  //change the clock status from running/stop/reset with the visibility
  function handleClockAction(floorIndex, elevatorIndex, { onChange: action, styles: newStyles }){
    //help function inside a function
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
      //set bottun color 
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
