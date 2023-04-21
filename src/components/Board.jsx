import '../styles/boardStyles.css';
import { useQueue } from '../context/Queue';
import '../constants/constants'
import { BUTTON_STATUS, TIMER, ELEVATOR_COLORS } from '../constants/constants';
import { useElevatorController} from '../context/elevatorController';
import { useFloorController } from '../context/floorController';



function Board ({ rows, columns }) {
  const {handleClockAction, createFloors, setButtonStatus} = useFloorController()
  

  const { enqueue , dequeue} = useQueue();

 
  //init elevator controller
  const {
    checkForAvailableElevator, 
    changeElevetorStatus, 
    changeElevatorColor,
    createElevetorsData} = useElevatorController();




/**
 * handle the event when elevator arrived to the destination
 * @param {number} elevatorId - the curr elevetor index in the columns
 * @param {number} floorIndex - the current flor index in the rows
 * @returns 
 */
function handleElevetorArrived(elevatorId, floorIndex){
  return () => {
    
    //change elevator color to green
    changeElevatorColor(elevatorId,ELEVATOR_COLORS.GREEN)

    //change button on the floot to arrived
    setButtonStatus(floorIndex, BUTTON_STATUS.ARRIVED)

    //reset and hide the timer on the square
    handleClockAction(floorIndex,elevatorId,TIMER.RESET)

     //check if there is a floor in pending queue
     const optionalFLoorTo = dequeue()

    //wait 2 sec
    setTimeout(() => {
      //if there is floor waiting for elevator send the elevator to that floor
      if (optionalFLoorTo !== undefined) {
        sendElevetorToFloor(elevatorId, floorIndex, optionalFLoorTo)
      }else{
        //bring back the color to black
        changeElevetorStatus(floorIndex, -1, elevatorId, () => {}, ELEVATOR_COLORS.BLACK)
      }
      setButtonStatus(floorIndex,BUTTON_STATUS.CALL)
    }, 2000);
  }
  
}

/**
 * handle when calling to an alevator
 * @param {number} floorIndex - the index of the floor that the calling from
 */
function handleElevatorReservation(floorIndex) {
  //if the elevator controller dont have Available elevator ...
  let elevator;
  if((elevator = checkForAvailableElevator(floorIndex)) === undefined){
    //push the floor to queue
    enqueue(floorIndex)  
    setButtonStatus(floorIndex, BUTTON_STATUS.WAITING)

  }else{
    //elevator index
    const elevatorNumber = elevator.key

    //if the elevator in the same floor stay for 2 sec
    if(elevator.currFloor === floorIndex) {
      setButtonStatus(floorIndex,BUTTON_STATUS.ARRIVED)
      changeElevatorColor(elevatorNumber, ELEVATOR_COLORS.GREEN)
      setTimeout(() => 
      {
        setButtonStatus(floorIndex,BUTTON_STATUS.CALL)
        changeElevatorColor(elevatorNumber, ELEVATOR_COLORS.BLACK)
      },2000)
    }

    else{
      //change bottun styles
      setButtonStatus(floorIndex, BUTTON_STATUS.WAITING)

      sendElevetorToFloor(elevatorNumber, elevator.currFloor, floorIndex)

    }
  }
}

function sendElevetorToFloor(elevatorId, currFLoor, toFloor){
  handleClockAction(toFloor, elevatorId,TIMER.START)
  const elevatorArrivedClouser = handleElevetorArrived(elevatorId ,toFloor)
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