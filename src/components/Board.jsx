import React, { useEffect, useRef, useState } from 'react';
import '../styles/boardStyles.css';
import Elevetor from './Elevator'
import { useQueue } from '../context/Queue';
import Floor from './Floor';

const Board = ({ rows, columns }) => {
  const squareRef = useRef(null);
  const [floorsData, setFloorsData] = useState(createFloorsData())
  const [width, setWidth] = useState(0);
  const [height, setHight] = useState(0);
  const [elevatorsData, setElevatorsData] = useState([]);
  const { enqueue, size , dequeue} = useQueue();



function initElevatorDta(width){
  const elevators = [];
  for (let i = 0; i < columns; i++) {
    elevators.push({
      key: i,
      y: 0,
      style: { backgroundColor: 'green', width: `${width}px`, left: `${i*(width-2)}px`},
      handleElevetorArrived: handleElevetorArrived(i, 0),
      occupied:false,
      currFloor: 0,
      toFloor: -1
    });
  }
  setElevatorsData(elevators);
}
//create floors data
function createFloorsData() {
  const ans = [];
  for (let i = 0; i < rows; i++) {
    ans.push({
      key: `floor-${i}`,
      index: rows - i - 1,
      button: {color: 'green',},
    });
  }
  return ans;
}
  //get width and hight for the style of the elevator
  useEffect(() => {
    if (squareRef.current) {
      const { width, height } = squareRef.current.getBoundingClientRect();
      setWidth(width)
      setHight(height)
      initElevatorDta(width)
    }
  }, [squareRef]);

//set bottun color 
function setBottunColor(bottunIndex, color){
  setFloorsData(prevData =>
    prevData.map(floorData => floorData.index===bottunIndex?{...floorData, button:{color:color}}:floorData))
}

function handleElevetorArrived(elevatorId, bottunNum){
  return () => {
    const optionalFLoorTo = dequeue()
    //set bottun color to blue
    setBottunColor(bottunNum, 'blue')
    //wait 2 secs
    setTimeout(() => {
      //in case there is an floor that wait for elevator
      if (optionalFLoorTo !== undefined) {
        console.log("arrived wer have mre job")
        setBottunColor(bottunNum,'red')
        setElevatorsData(prevData => (prevData.map(data =>
          data.key === elevatorId?{...data, 
          handleElevetorArrived: handleElevetorArrived(data.key ,optionalFLoorTo),
          currFloor: bottunNum,
          toFloor: optionalFLoorTo,
          y:-(height - 2)*optionalFLoorTo}: 
          data )))
          setBottunColor(optionalFLoorTo,'red')
        //just set occupied and wait for reservetion
      }else{
        setElevatorsData(prevData => (prevData.map(data =>
            data.key === elevatorId?{...data, 
            currFloor: bottunNum,
            toFloor: -1,
            occupied: false }: 
            data )))
      }
      setBottunColor(bottunNum,'green')
    }, 2000);
  }
  
}

//choose elevator if not found return undifined
function chooseTheClosestElevator(toFloor){
  
    let availableElevators = elevatorsData.filter(elevator => !elevator.occupied)
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


//when a floor want elevator reservation
 function handleElevatorReservation(floorIndex) {
    //check if there was a reservation
    if (floorsData.find(floor => floor.index === floorIndex).button.color !== 'green') {
      console.log("here")
      return; // Do nothing if the button is red or waiting
    }
    //if all the elevators are full put the floor on pending queue
    let elevator;
    if(size() > 0 || (elevator = chooseTheClosestElevator(floorIndex)) === undefined){
      enqueue(floorIndex)  
      setBottunColor(floorIndex,'red')
  //else have elevator change y value and go there
    }else{
      const elevatorNumber = elevator.key

      //stay on the floor
      if(elevator.currFloor === floorIndex){
        setBottunColor(floorIndex,'blue')
        setTimeout(() => {setBottunColor(floorIndex,'green')},2000)
      }
      else{
        setBottunColor(floorIndex,'red')
        setElevatorsData(prevData => (prevData.map(data =>
          {
            const oldFloor = data.currFloor
            return data.key === elevatorNumber?{...data, 
              handleElevetorArrived: handleElevetorArrived(data.key ,floorIndex),
              currFloor:oldFloor,
              toFloor: floorIndex,
              occupied: true, 
              y:-(height - 2)*floorIndex}: data 
          })))
      }
    }
    
  }

  const createBoard2 = () => {
    return floorsData.map((floorData) => (
      <Floor
        columns={columns}
        squareRef={squareRef}
        key={floorData.key}
        index={floorData.index}
        button={floorData.button}
        handleElevatorReservation={handleElevatorReservation}
      />
    ));
  };

  
  return (<div className="board">
      {createBoard2()}
      {elevatorsData.map(data => (
      <Elevetor
        key={data.key}
        y={data.y}
        style={{backgroundColor: 'green', width: `${width}px`, left: `${data.key*(width-2)}px`}}
        handleElevetorArrived={handleElevetorArrived(data.key, data.toFloor)}
      />
    ))}   
  </div>);
  
};

export default Board;