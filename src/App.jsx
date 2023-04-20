import './App.css';
import Board from './components/Board'
import QueueProvider from './context/Queue';


function App() {
  return (
    
    <div className='exercise-container'>
      <h1 className='exercise-header'>Elevator Exercise</h1>
    <QueueProvider>
    
     
    <Board rows={10} columns={5} />
    
  </QueueProvider>
  </div>
  );
}

export default App;
