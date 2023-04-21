import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { ELEVATOR_COLORS } from '../constants/constants';
import { useQueue } from './Queue';
import { AudioPlayerProvider } from '../context/playMusic';
import { audioFilePath } from '../constants/config';
import Elevetor from '../components/Elevator'



const ElevatorControllerContext = createContext();



export const useElevatorController = () => {
  return useContext(ElevatorControllerContext);
};

const ElevatorControllerProvider = ({ children, elevatorsNum }) => {
  const squareRef = useRef(null)
  const [elevatorsData, setElevatorsData] = useState([]);
  const {size} = useQueue()
  const [squareData, setSquareData] = useState({})
  const width = squareData.width 
  const height = squareData.height 
  
//initiate data of the elevators
  useEffect(() => {
    if (squareRef.current) {
      const squarFef = squareRef.current.getBoundingClientRect();
      setSquareData(squarFef)
      //elevatorController function to init the elevetors data
      initElevatorDta(width)
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [squareRef]);

  // init the elevators
  function initElevatorDta(width) {
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

  //choose the colsest elevator, if not exists return undifined
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

  function checkForAvailableElevator(floorIndex){
    // if someone waiting to an elevator
    if(size() > 0){
      return undefined
      //use choose closest elevator if there is one..
    }else{
      return chooseTheClosestElevator(floorIndex)
    }
  }
  


  function changeElevetorStatus(currFloor,toFloor, elevatorNumber, afterArrivedClouser, color){
    //if curr floor is -1 thats elevator didnt move..
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

 function changeElevatorColor(elevatorId, color){
  setElevatorsData(prevData => (prevData.map(data =>
    data.key === elevatorId?{
      ...data, 
      color: color
    }: 
    data )))
  }


  //create elevator data
  function createElevetorsData(elevatorHandleClouser, columns, rows){
    return  <div className='elevators-container' style={{width: `${width*columns}px`,height: `${height*rows}px`}}>
    {elevatorsData.map(data => (
      <AudioPlayerProvider path={audioFilePath} key = {data.key} index={data.key}>
        <Elevetor
          key={data.key}
          y={data.y}
          color={data.color}
          style={{ width: `${width}px`, height: `${height}px` }}
          handleElevetorArrived={elevatorHandleClouser(data.key, data.toFloor)}
          dist={data.dist}
        />
      </AudioPlayerProvider>
    )) }
    </div>
  }


  const value = {  
    squareRef,
    checkForAvailableElevator, 
    changeElevetorStatus, 
    changeElevatorColor,
    createElevetorsData};
  return (
    <ElevatorControllerContext.Provider value={value}>
      {children}
    </ElevatorControllerContext.Provider>
  );
};

export default ElevatorControllerProvider;
