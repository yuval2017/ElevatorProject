import { animated, useSpring } from 'react-spring';
import '../styles/elevatorStyles.css'
import { useAudioPlayer } from '../context/playMusic';
import { useEffect } from 'react';
import { ELEVATOR_COLORS } from '../constants/constants';

function Elevator ({ y , style, handleElevetorArrived, color, dist})  {
  const { playAudio } = useAudioPlayer();
  

useEffect(() => {
  if (color === ELEVATOR_COLORS.GREEN) {
      playAudio()
  }
   // eslint-disable-next-line react-hooks/exhaustive-deps
}, [color]);

  const spring = useSpring({
    to: { y },
    
    config: {
      clamp:true,
      // duration: 7000, // set a longer duration for the animation
      //mass: 20, // increase the mass value to make the animation slower and more deliberate
      tension: 20/dist, // reduce the tension value to make the animation slower and smoother
      friction: 10, // increase the friction value to make the animation smoother
      mass:200
    
    },
   onRest: () => {

    handleElevetorArrived();
  },
  });
 
  return (

    <animated.div
    className="elevator"
    style={{
      ...style,
      transform: spring.y.to(y => `translateY(${y}px)`),        
    }}>
      {/* <div className='image-container'></div> */}
      <img className="elevator-image" src={`./elevatorSvg/icons8-elevator-${color}.svg`} alt = "Woops"></img>
    </animated.div>
  );
};

export default Elevator;