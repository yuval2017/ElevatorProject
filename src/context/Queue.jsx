import React, { createContext, useContext, useState } from 'react';


const QueueContext = createContext();

export const useQueue = () => {
  return useContext(QueueContext);
};

const QueueProvider = ({ children }) => {
  const [queue, setQueue] = useState([]);

  const enqueue = (item) => {
    setQueue((prevQueue) => [...prevQueue, item]);
  };

  const dequeue = () => {
    if (queue.length === 0) {
      return undefined;
    }
    const item = queue[0];
    setQueue((prevQueue) => prevQueue.slice(1));
    return item;
  };

  const peek = () => {
    if (queue.length === 0) {
      return undefined;
    }
    return queue[0];
  };

  const size = () => {
    return queue.length;
  };
  const value = { enqueue, dequeue, peek, size }

  return (
    <QueueContext.Provider value={value}>
      {children}
    </QueueContext.Provider>
  );
};

export default QueueProvider;
