import { animated, useSpring,  } from 'react-spring';
import { useEffect } from 'react';
import PropTypes from 'prop-types';
// Styles
import '../styles/elevatorStyles.css'
// Contexts
import { useAudioPlayer } from '../context/playMusic';
// Constants
import { ELEVATOR_COLORS } from '../constants/constants';
import { ELEVATOR_CLAMP, ELEVATOR_DURATION, ELEVATOR_FRICTION, ELEVATOR_MASS, ELEVATOR_TENSTION } from '../constants/config';




function Elevator ({ y , style, handleElevetorArrived, color, dist})  {
  const { playAudio } = useAudioPlayer();


useEffect(() => {
  if (color === ELEVATOR_COLORS.GREEN) {
      playAudio()
  }
   // eslint-disable-next-line react-hooks/exhaustive-deps
}, [color]);

const tension = dist * ELEVATOR_TENSTION;
const friction = dist * ELEVATOR_FRICTION;
const config = ELEVATOR_DURATION?
  {
    clamp: ELEVATOR_CLAMP,
    tension,
    friction,
    mass: ELEVATOR_MASS,
    duration: ELEVATOR_DURATION
  }:{
  clamp: ELEVATOR_CLAMP,
  tension,
  friction,
  mass: ELEVATOR_MASS,
}

const spring = useSpring({
  to: { y },
  config: config,
  onRest: () => {
    handleElevetorArrived();
  },
  onUpdate: ({ y }) => {
    console.log(`Elevator current position: ${y}`);
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
Elevator.propTypes = {
  y: PropTypes.number.isRequired,
  dist: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  handleElevetorArrived: PropTypes.func.isRequired,
  styles: PropTypes.object.isRequired,
  squareRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.any })]),
};
export default Elevator;