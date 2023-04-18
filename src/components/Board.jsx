import React, { useEffect, useRef, useState } from 'react';
import '../styles/boardStyles.css';
import Elevetor from './Elevator'
import { useQueue } from '../context/Queue';

const Board = ({ rows, columns }) => {
  const squareRef = useRef(null);
  const [buttonColors, setButtonColors] = useState(Array(rows).fill('green'));
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
  //get width and hight for the style of the elevator
  useEffect(() => {
    if (squareRef.current) {
      const { width, height } = squareRef.current.getBoundingClientRect();
      setWidth(width)
      setHight(height)

      initElevatorDta(width)
    }
  }, []);

//set bottun color 
function setBottunColor(bottunIndex, color){
    setButtonColors((prevButtonColors) => {
      const newButtonColors = [...prevButtonColors];
      newButtonColors[bottunIndex] = color;
      return newButtonColors;
    });
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
    if (buttonColors[floorIndex] !== 'green') {
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


  //create the board row and columns
  const createBoard = () => {
    const board = [];
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < columns; j++) {
        row.push(
          <div key={`cell-${i}-${j}`} className="square p-2 bg-white" ref={i === 0 && j === 0 ? squareRef : null} />
        );
      }
      board.push(
        <div key={`row-${i}`} className="d-flex flex-row align-items-center">
          <div className="row-number me-2">{`${rows-i-1===0?"Grownd Floor" : rows-i-1===1?"1st":rows-i-1===2?"2nd": rows-i-1===3?"3nd":`${rows-i-1}th`}`}</div>
          {row}
          <div className="moving-object-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
      
            <button type="button"
                id ={`bottun${rows-i-1}`}  
                disabled={false} className="elevator-button-arrived"  
                style={{backgroundColor:buttonColors[rows-i-1] }} 
                onClick={()=>handleElevatorReservation(rows-i-1)} >Call</button>
          </div>
        </div>
      );
    }
    return board;
  };
  


  
  return <div className="board">
    
      {createBoard()}
      {elevatorsData.map(data => (
        <Elevetor
          key={data.key}
          y={data.y}
          style={{backgroundColor: 'green', width: `${width}px`, left: `${data.key*(width-2)}px`}}
          handleElevetorArrived={handleElevetorArrived(data.key, data.toFloor)}
        />
    ))}
      
  </div>;
  
};

export default Board;