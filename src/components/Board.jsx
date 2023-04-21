import React from 'react';
import '../styles/boardStyles.css';
import { useQueue } from '../context/Queue';
import '../constants/constants'
import { BUTTON_STATUS, TIMER, ELEVATOR_COLORS } from '../constants/constants';
import { useElevatorController} from '../context/elevatorController';
import { useFloorController } from '../context/floorController';



function Board ({ rows, columns }) {

  const {handleClockAction, setBottunColor, createFloors} = useFloorController()

  const { enqueue , dequeue} = useQueue();

  //init elevator controller
  const {
    checkForAvailableElevator, 
    changeElevetorStatus, 
    changeElevatorColor,
    createElevetorsData} = useElevatorController();


//that data to change the elevator position, width,hight dynamicly


function handleElevetorArrived(elevatorId, floorIndex){
  return () => {
    
    //alevator arrived change the color
    changeElevatorColor(elevatorId,ELEVATOR_COLORS.GREEN)

    //set button to arrived
    setBottunColor(floorIndex, BUTTON_STATUS.ARRIVED)

    //reset the time and hide clock
    handleClockAction(floorIndex,elevatorId,TIMER.RESET)

     //make it the elevator color to green, and bottun to the new style
     const optionalFLoorTo = dequeue()

    //wait 2 secs before choose what is the next elevator mission
    setTimeout(() => {

      //in case there is an floor that wait for elevator in the pending queue go to that floor
      if (optionalFLoorTo !== undefined) {
        //send to elevator to this floor
        sendElevetorToFloor(elevatorId, floorIndex, optionalFLoorTo)
      //the elevator ready for more "missions"
      }else{
        changeElevetorStatus(floorIndex, -1, elevatorId, () => {}, ELEVATOR_COLORS.BLACK)
      }
      setBottunColor(floorIndex,BUTTON_STATUS.CALL)
    }, 2000);
  }
  
}

//when a floor want elevator reservation
function handleElevatorReservation(floorIndex) {
  //if the elevator controller dont have Available elevator ...
  let elevator;
  if((elevator = checkForAvailableElevator(floorIndex)) === undefined){
    enqueue(floorIndex)  
    setBottunColor(floorIndex, BUTTON_STATUS.WAITING)

//else have elevator change y value and go there
  }else{
    //elevator index
    const elevatorNumber = elevator.key

    //if there is elevator in the floor elevator arrived
    if(elevator.currFloor === floorIndex) {
      setBottunColor(floorIndex,BUTTON_STATUS.ARRIVED)
      changeElevatorColor(elevatorNumber, ELEVATOR_COLORS.GREEN)
      setTimeout(() => 
      {
        setBottunColor(floorIndex,BUTTON_STATUS.CALL)
        changeElevatorColor(elevatorNumber, ELEVATOR_COLORS.BLACK)
      },2000)
    }

    else{
      //set the floor bottun color
      setBottunColor(floorIndex, BUTTON_STATUS.WAITING)

      //send the elevator to this floor
      sendElevetorToFloor(elevatorNumber, elevator.currFloor, floorIndex)

    }
  }
}

function sendElevetorToFloor(elevatorId, currFLoor, toFloor){
  //start the square timer
  handleClockAction(toFloor, elevatorId,TIMER.START)

  // //create clouser for the elevator
  const elevatorArrivedClouser = handleElevetorArrived(elevatorId ,toFloor)

  // //use elevatorController to move the elevator to the floor
  changeElevetorStatus(currFLoor, toFloor, elevatorId, elevatorArrivedClouser, ELEVATOR_COLORS.RED)
}



  return (
    <div className='main'>
      <div className="board">
        {createFloors(handleElevatorReservation)}
        {createElevetorsData(handleElevetorArrived, columns, rows)}
    </div>
  </div>);
  
};

export default Board;