import React, { useEffect, useRef, useState } from 'react';
import '../styles/boardStyles.css';
import Elevetor from './Elevator'
import { useQueue } from '../context/Queue';
import Floor from './Floor';


const Board = ({ rows, columns }) => {
  const squareRef = useRef(null);
  const [squareData, setSquareData] = useState({})
  const [floorsData, setFloorsData] = useState(createFloorsData())
  const [elevatorsData, setElevatorsData] = useState([]);
  const { enqueue, size , dequeue} = useQueue();


//that data to change the elevator position, width,hight dynamicly
const width = squareData.width 
const height = squareData.height 





//create floors data
function createFloorsData() {
  const ans = [];
  for (let i = 0; i < rows; i++) {
    const timesArr = new Array(columns).fill({onChange: 'stop', styles: {opacity: 0}}); 
    ans.push({
      key: `floor-${i}`,
      index: rows - i - 1,
      buttonStatus: 'call',
      timeArr: timesArr
    });
  }
  return ans;
}




  useEffect(() => {
    if (squareRef.current) {
      
      const { width, height, left, bottom} = squareRef.current.getBoundingClientRect();
      setSquareData({width, height, left, bottom})

      initElevatorDta(width)
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  function initElevatorDta(width){
    const elevators = [];
    for (let i = 0; i < columns; i++) {
      elevators.push({
        key: i,
        y: 0,
        style: { backgroundColor: 'green', width: `${width}px`, left: `${i*(width)}px`},
        handleElevetorArrived: handleElevetorArrived(i, 0),
        occupied:false,
        currFloor: 0,
        toFloor: -1,
        color: 'black'
      });
    }
    setElevatorsData(elevators);
  }

//set bottun color 
function setBottunColor(bottunIndex, newStatus){
  setFloorsData(prevData =>
    prevData.map(floorData => floorData.index===bottunIndex?{...floorData, buttonStatus: newStatus}:floorData))
}

function handleElevetorArrived(elevatorId, floorIndex){
  return () => {
    
    //make it the elivator color to green, and bottun to the new style
    const optionalFLoorTo = dequeue()
    setElevatorsData(prevData => (prevData.map(data =>
      data.key === elevatorId?{...data, 
      color:'green'
      }: 
      data )))
    setBottunColor(floorIndex, 'arrived')

    handleClockAction(floorIndex,elevatorId,'reset',{opacity: 0})
    //wait 2 secs before choose what is the next elevator mission
    setTimeout(() => {
      //in case there is an floor that wait for elevator in the pending queue go to that floor
      if (optionalFLoorTo !== undefined) {
        setBottunColor(floorIndex,'waiting')
        setElevatorsData(prevData => (prevData.map(data =>
          data.key === elevatorId?{...data, 
          handleElevetorArrived: handleElevetorArrived(data.key ,optionalFLoorTo),
          currFloor: floorIndex,
          toFloor: optionalFLoorTo,
          y:-(height)*optionalFLoorTo,
          color: 'red'
          }: 
          data )))
          setBottunColor(optionalFLoorTo,'waiting')

        //else change the elevator color to black and wait for any reservation
      }else{

        setElevatorsData(prevData => (prevData.map(data =>
            data.key === elevatorId?{...data, 
            currFloor: floorIndex,
            toFloor: -1,
            occupied: false,
            color:'black'       
          }: 
            data )))
      }
      setBottunColor(floorIndex,'call')
    }, 2000);
  }
  
}

//choose the colsest elevator, if not exists return undifined
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

function handleClockAction(floorIndex, elevatorIndex, action, newStyles){

  function setTime(timersArr) {
    console.log(elevatorIndex ,timersArr)

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

  setFloorsData(prevData =>
      prevData.map(floorData =>
        {
          const newData = floorData.index === floorIndex? {
            ...floorData, 
            timeArr: setTime(floorData.timeArr)
          }:floorData 
          if(floorData.index === floorIndex){
            
            console.log("here ",newData)
          }
          return newData
        }
     
    ))
}

//when a floor want elevator reservation
 function handleElevatorReservation(floorIndex) {

    
    

    //if all the elevators are full put the floor on pending queue
    let elevator;
    if(size() > 0 || (elevator = chooseTheClosestElevator(floorIndex)) === undefined){
      enqueue(floorIndex)  
      setBottunColor(floorIndex,'waiting')

  //else have elevator change y value and go there
    }else{
      const elevatorNumber = elevator.key



      //if there is elevatoe in the floor just say the elevator arrived
      if(elevator.currFloor === floorIndex){
        setBottunColor(floorIndex,'arrived')
        setTimeout(() => {setBottunColor(floorIndex,'call')},2000)
      }
      
      //move the elevator to the floor
      else{
        handleClockAction(floorIndex,elevatorNumber,'start',{opacity: 1})
        setBottunColor(floorIndex,'waiting')

        setElevatorsData(prevData => (prevData.map(data =>
          {
            const oldFloor = data.currFloor
  
            return data.key === elevatorNumber?
            {
              ...data, 
              handleElevetorArrived: handleElevetorArrived(data.key ,floorIndex),
              currFloor:oldFloor,
              toFloor: floorIndex,
              occupied: true, 
              color: 'red',
              y:-(height)*floorIndex,
            
            }: data 
              
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
        buttonStatus={floorData.buttonStatus}
        handleElevatorReservation={handleElevatorReservation}
        timesData = {floorData.timeArr}
      />
    ));
  };
  console.log(width)
  return (
    <div className='main'>
      <div className="board">
        {createBoard2()}
        <div className='elevators-container' style={{width: `${width*columns}px`,height: `${height*rows}px`}}>

        {elevatorsData.map(data => (
        <Elevetor
          key={data.key}
          y={data.y}
          color = {data.color}
          style={{ width: `${width}px`, height: `${height}px`}}
          handleElevetorArrived={handleElevetorArrived(data.key, data.toFloor)}
          
        />
      ))} 
      </div>
    </div>
  </div>);
  
};

export default Board;