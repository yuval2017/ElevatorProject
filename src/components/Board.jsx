// Styles
import '../styles/boardStyles.css';
// Constants
import '../constants/constants'
import { BUTTON_STATUS, TIMER, ELEVATOR_COLORS } from '../constants/constants';
// Contexts
import { useQueue } from '../context/Queue';
import { useElevatorController} from '../context/elevatorController';
import { useFloorController } from '../context/floorController';
//Props types
import PropTypes from 'prop-types';



// The Board component represents the main elevator board containing floors and elevators.
function Board ({ rows, columns }) {
  
/**
   * control the elevators
   */
const {
  squareRef,
  checkForAvailableElevator, 
  changeElevatorStatus, 
  changeElevatorColor,
  createElevatorData} = useElevatorController();

  const {handleClockAction, createFloors, setButtonStatus} = useFloorController(squareRef)

  /**
   * pending queue
   */
  const { enqueue , dequeue} = useQueue();
 
  


/**
 * Handles the case that the elevator has reached the requested floor
 * @param {number} elevatorId - The current elevetor 
 * @param {number} floorIndex - The current flor index
 * @returns 
 */
function handleElevatorArrived(elevatorId, floorIndex){
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
        sendElevatorToFloor(elevatorId, floorIndex, optionalFLoorTo)
      }else{
        //bring back the color to black
        changeElevatorStatus(floorIndex, -1, elevatorId, () => {}, ELEVATOR_COLORS.BLACK)
      }
      setButtonStatus(floorIndex,BUTTON_STATUS.CALL)
    }, 2000);
  }
  
}

/**
 * Called when a floor requests an elevator
 * @param {number} floorIndex - The index of the floor to which the elevator will go
 */
function handleElevatorReservation(floorIndex) {
  //if the elevator controller dont have Available elevator ...
  let elevator;
  if((elevator = checkForAvailableElevator(floorIndex)) === undefined){
    //push the floor to pending queue
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

      sendElevatorToFloor(elevatorNumber, elevator.currFloor, floorIndex)

    }
  }
}

function sendElevatorToFloor(elevatorId, currFLoor, toFloor){
  handleClockAction(toFloor, elevatorId,TIMER.START)
  const elevatorArrivedClouser = handleElevatorArrived(elevatorId ,toFloor)
  changeElevatorStatus(currFLoor, toFloor, elevatorId, elevatorArrivedClouser, ELEVATOR_COLORS.RED)
}

  return (
    <div className='main' >
      <div id="container" className="board"  >
        {createFloors(handleElevatorReservation)}
        {createElevatorData(handleElevatorArrived, columns, rows)}
    </div>
  </div>);
  
};
Board.propTypes = {
  rows: PropTypes.number.isRequired,
  columns: PropTypes.number.isRequired,
}; 
export default Board;