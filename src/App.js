import './App.css';
import Board from './components/Board'

function App() {
  return (
    <>
    <h1>Board</h1>
    <Board rows = {10} columns = {5}/>
    </>
  );
}

export default App;
