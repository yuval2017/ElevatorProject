import React, { useEffect, useRef, useState } from 'react';
import '../styles/boardStyles.css';
import Elevetor from './Elevator'

const Board = ({ rows, columns }) => {
  const squareRef = useRef(null);
  const [buttonColors, setButtonColors] = useState(Array(rows).fill('green'));
  const [width, setWidth] = useState(0);
  const [height, setHight] = useState(0);
  const [elevatorsData, setElevatorsData] = useState([]);
  const [pendingQueue, setPendingQueue] = useState([]); 


function initElevatorDta(width){
  const arr = [];
  for (let i = 0; i < columns; i++) {
    arr.push({
      key: i,
      y: 0,
      style: { backgroundColor: 'green', width: `${width}px`, left: `${i*(width-2)}px`},
      handleElevetorArrived: () => handleElevetorArrived(i, 0),
      occupied:false,
      currFloor: 0
    });
  }
  setElevatorsData(arr);
}
  //get width and hight for the style of the elevator
  useEffect(() => {
    if (squareRef.current) {
      const { width, height } = squareRef.current.getBoundingClientRect();
      setWidth(width)
      setHight(height)
      //console.log("Width X:", width, "Height Y:", height);
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
  console.log("handeling arrived")
  //set bottun color
  setBottunColor(bottunNum,'blue')
  //wait 2 secs
  setTimeout(() => {
    //in case there is an floor that want an elevator
    if (pendingQueue.length > 0) {
      setBottunColor(bottunNum,'red')
      const floorNumber = pendingQueue[0];
      setPendingQueue(prevQueue => prevQueue.slice(1));
      setElevatorsData(prevData => (prevData.map(data =>
      data.key === elevatorId?{...data, 
        occupied: false,  
        handleElevetorArrived: ()=>handleElevetorArrived(data.key ,floorNumber),
        currFloor: floorNumber,
        y:-(height - 2)*floorNumber}: 
        data )))
      //just set occupied and wait for reservetion
    }else{
      setBottunColor(bottunNum,'green')
      setElevatorsData(prevData => (prevData.map(data =>
          data.key === elevatorId?{...data, 
          currFloor: bottunNum,
          occupied: false }: 
          data )))

    }
  }, 2000);
}
//choose elevator if not found return undifined
function chooseTheClosestElevator(toFloor){
  
    let availableElevators = elevatorsData.filter(elevator => !elevator.occupied)
    console.log(availableElevators)

    let closestObject = availableElevators[0];
    let closestDistance = Math.abs(availableElevators[0].currFloor - toFloor);

    for (const object of availableElevators) {
      const distance = Math.abs(object.currFloor - toFloor);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestObject = object;
      }
  }
  return closestObject.key
}
//when a floor want elevator reservation
function handleElevatorReservation(floorIndex) {
  //check if there was a reservation
  if (buttonColors[floorIndex] !== 'green') {
    console.log("here")
    return; // Do nothing if the button is red or waiting
  }
  console.log("create reservation")
  let elevatorNumber;
 
  if(pendingQueue.length > 0 || (elevatorNumber = chooseTheClosestElevator(floorIndex)) === undefined){
    console.log("dont need to be here initially")
    setPendingQueue(prevQueue=>([...prevQueue,floorIndex]))
    
  }else{
    console.log(`Choose Elevator ${elevatorNumber}`)

    setElevatorsData(prevData => (prevData.map(data =>
    data.key === elevatorNumber?{...data, 
        handleElevetorArrived: ()=>handleElevetorArrived(data.key ,floorIndex) ,
        currFloor:floorIndex,
        occupied: true, 
        y:-(height - 2)*floorIndex}: data )))
  }
  //set the new y value
    
    setBottunColor(floorIndex,'red')
  
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
        handleElevetorArrived={data.handleElevetorArrived}
      />
    ))}
      
  </div>;
  
};

export default Board;