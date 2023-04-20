import React, { useState, useRef, useEffect } from 'react';
import '../styles/timerStyles.css'


const CountDownTimer = ({onChange, styles}) => {
  const [time, setTime] = useState(0);
  const intervalRef = useRef();


  useEffect(() => {
    if(onChange === 'start'){
      handleStart()
    }
    else if(onChange === 'stop'){
      handleStop()
    }
    else if(onChange === 'reset'){
      handleReset()
    }
  }, [onChange]);

  const handleStart = () => {
    intervalRef.current = setInterval(() => {
      setTime((prevTime) => prevTime + 10);
    }, 10);
  };

  const handleStop = () => {
    clearInterval(intervalRef.current);
  };


  const handleReset = () => {
    clearInterval(intervalRef.current);
    setTime(0);
  };

  const formatTime = (time) => {
    const minutes = Math.floor((time / 1000 / 60) % 60);
    const seconds = Math.floor((time / 1000) % 60);

    const formattedMinutes = minutes.toString();
    const formattedSeconds = seconds.toString();

    return `${formattedMinutes} min. ${formattedSeconds} sec.`;
  };

  return (
  <div className="timer" style={styles}>
    {formatTime(time)}
  </div>
  );
};

export default CountDownTimer;
