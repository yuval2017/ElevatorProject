import './App.css';
import Board from './components/Board';
import QueueProvider from './context/Queue';
import { NUMBER_OF_ELEVATORS, NUMBER_OF_FLOORS } from './constants/config';
import { ElevatorControllerProvider } from './context/elevatorController';
import FloorControllerProvider from './context/floorController';
import { useState } from 'react';

function App() {
  const [start, setStart] = useState(false);

  return start ? (
    <div className="exercise-container">
      <h1 className="exercise-header">Elevator Exercise</h1>
      <QueueProvider>
        <ElevatorControllerProvider elevatorsNum={NUMBER_OF_ELEVATORS}>
          <FloorControllerProvider
            rows={NUMBER_OF_FLOORS}
            columns={NUMBER_OF_ELEVATORS}
          >
            <Board
              rows={NUMBER_OF_FLOORS}
              columns={NUMBER_OF_ELEVATORS}
            />
          </FloorControllerProvider>
        </ElevatorControllerProvider>
      </QueueProvider>
    </div>
  ) : (
    <div className="button-container">
      <button className="start" onClick={() => setStart(true)}>
        <i className="fas fa-play"></i>
        Start
      </button>
    </div>
  );
}

export default App;
