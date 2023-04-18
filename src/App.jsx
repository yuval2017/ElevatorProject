import './App.css';
import Board from './components/Board'
import QueueProvider from './context/Queue';


function App() {
  return (
    <QueueProvider>
    <Board rows={11} columns={5} />
  </QueueProvider>
  );
}

export default App;
