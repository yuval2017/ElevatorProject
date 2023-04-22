import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
// Constants
import { ELEVATOR_COLORS } from '../constants/constants';
// Contexts
import { useQueue } from './Queue';
import { AudioPlayerProvider } from '../context/playMusic';
import { audioFilePath } from '../constants/config';
// Conponents
import Elevetor from '../components/Elevator'



const ElevatorControllerContext = createContext();

const useElevatorController = (additionalData) => {
  const context = useContext(ElevatorControllerContext);
  return { ...context, ...additionalData };
};

const ElevatorControllerProvider = ({ children, elevatorsNum, additionalData }) => {
  const squareRef = useRef(null)
  const [elevatorsData, setElevatorsData] = useState([]);
  const {size} = useQueue()
  const [squareData, setSquareData] = useState({})
  const width = squareData.width 
  const height = squareData.height 
  
//initiate thes square and elevators data
useEffect(() => {
  if (squareRef.current) {
    const squareRect = squareRef.current.getBoundingClientRect();
    setSquareData(squareRect);
    initElevatorData(squareRect.width);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [squareRef]);

  function initElevatorData(width) {
    const elevators = [];
    for (let i = 0; i < elevatorsNum; i++) {
      elevators.push({
        key: i,
        y: 0,
        style: {width: `${width}px`, left: `${i*(width)}px`},
        currFloor: 0,
        toFloor: -1,
        color: ELEVATOR_COLORS.BLACK,
        dist: 0,
      });
    }
    setElevatorsData(elevators);
  }

  /**
   * 
   * @param {number} toFloor - The floor from which a call to the elevator was made
   * @returns The most closest elevator to the floor
   */
  function chooseTheClosestElevator(toFloor){
    let availableElevators = elevatorsData.filter(elevator => elevator.color===ELEVATOR_COLORS.BLACK)
    if(availableElevators.length === 0){
      return undefined;
    }
    let closestElevator = availableElevators[0];
    let closestDistance = Math.abs(availableElevators[0].currFloor - toFloor);

    for (const object of availableElevators) {
      const distance = Math.abs(object.currFloor - toFloor);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestElevator = object;
      } 
    }
    return closestElevator
  }

  /**
   * Check if there is available elevator
   * @param {number} floorIndex - The index of the floor
   * @returns Undefined if there is no elevator, else return an elevator column index
   */
  function checkForAvailableElevator(floorIndex){
    // if someone waiting to an elevator
    if(size() > 0){
      return undefined
      //use choose closest elevator if there is one..
    }else{
      return chooseTheClosestElevator(floorIndex)
    }
  }
  

  /**
   * 
   * @param {number} currFloor - The floor where the elevator is.
   * @param {number} toFloor - The floor to which the elevator should reach.
   * @param {number} elevatorNumber - Elevator index.
   * @param {funtion} afterArrivedClouser - The action to be taken after the elevator arrives.
   * @param {string} color - The color new color of the elevator.
   */
  function changeElevatorStatus(currFloor,toFloor, elevatorNumber, afterArrivedClouser, color){
    setElevatorsData(prevData => (prevData.map(data =>
      {
        return data.key === elevatorNumber?
        {
          ...data, 
          handleElevetorArrived: afterArrivedClouser,
          currFloor: currFloor,
          toFloor: toFloor,
          color: color,
          y: toFloor === -1? data.y : -(height)*toFloor,
          dist: toFloor === -1 ? 0 : Math.abs(currFloor-toFloor)       
        }: data 
      })))
  }

  /**
   * 
   * @param {number} elevatorId - Elevator index.
   * @param {string} color - The new color to.
   */
 function changeElevatorColor(elevatorId, color){
  setElevatorsData(prevData => (prevData.map(data =>
    data.key === elevatorId?{
      ...data, 
      color: color
    }: 
    data )))
  }


  /**
   * 
   * @param {*} elevatorHandleClouser - The action to be taken after the elevator arrives.
   * @param {*} columns - Number of elevators, here it needed to make the clock watch on each square.
   * @param {*} rows - Number of floors.
   * @returns Elevators in HTML code
   */
  function createElevatorData(afterArrivedClouser, columns, rows){
    return (
      <div className='elevators-container' style={{width: `${width*columns}px`,height: `${height*rows}px`}}>
        {elevatorsData.map(data => (
          <AudioPlayerProvider path={audioFilePath} key={data.key} index={data.key}>
              <Elevetor
                key={data.key}
                y={data.y}
                color={data.color}
                styles={{ width: `${width}px`, height: `${height}px` }}
                handleElevetorArrived={afterArrivedClouser(data.key, data.toFloor)}
                dist={data.dist}
              />
          </AudioPlayerProvider>
        ))}
      </div>
    );
  }
  
  const value = {
    squareRef: squareRef,
    checkForAvailableElevator,
    changeElevatorStatus,
    changeElevatorColor,
    createElevatorData,
  };
  return (
    <ElevatorControllerContext.Provider value={value}>
      {children}
    </ElevatorControllerContext.Provider>
  );
};
ElevatorControllerProvider.propTypes = {
  children: PropTypes.node.isRequired,
  elevatorsNum: PropTypes.number.isRequired,
  additionalData: PropTypes.object,
};
export { ElevatorControllerProvider, useElevatorController, ElevatorControllerContext };
