import { animated, useSpring } from 'react-spring';
import '../styles/elevatorStyles.css'


const Elevator = ({ y , style, handleElevetorArrived, color}) => {


  const spring = useSpring({
    to: { y },
    config: {
      clamp:true,
      // duration: 7000, // set a longer duration for the animation
      mass: 20, // increase the mass value to make the animation slower and more deliberate
      tension: 2, // reduce the tension value to make the animation slower and smoother
      friction: 2, // increase the friction value to make the animation smoother
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
      <img className="elevator-image" src={`./icons8-elevator-${color}.svg`} alt = "Woops"></img>
    </animated.div>
  );
};

export default Elevator;