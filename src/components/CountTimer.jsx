import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
// Styles
import '../styles/timerStyles.css'
// Constants
import { TIMER } from '../constants/constants';


function CountDownTimer  ({onChange, styles}) {

  const [time, setTime] = useState(0);
  const intervalRef = useRef();


  useEffect(() => {
    if(onChange === TIMER.START.onChange){
      handleStart()
    }
    else if(onChange === TIMER.STOP.onChange){
      handleStop()
    }
    else if(onChange === TIMER.RESET.onChange){
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
CountDownTimer.propTypes = {
  onChange: PropTypes.string.isRequired,
  styles: PropTypes.object.isRequired,
};

export default CountDownTimer;
