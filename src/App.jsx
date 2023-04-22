import './App.css';
import Board from './components/Board'
import QueueProvider from './context/Queue';
import { NUMBER_OF_ELEVATORS, NUMBER_OF_FLOORS } from './constants/config';
import ElevatorControllerProvider from './context/elevatorController';
import FloorControllerProvider from './context/floorController';


function App() {


  return (

    
      <div className='exercise-container'>
        <h1 className='exercise-header'>Elevator Exercise</h1>

      <QueueProvider>
      <ElevatorControllerProvider elevatorsNum = {NUMBER_OF_ELEVATORS}>
        <FloorControllerProvider rows = {NUMBER_OF_FLOORS} columns = {NUMBER_OF_ELEVATORS}>       
          <Board rows={NUMBER_OF_FLOORS} columns={NUMBER_OF_ELEVATORS} />
          </FloorControllerProvider>
      </ElevatorControllerProvider>
       
      </QueueProvider>
    </div>

  );
}

export default App;
