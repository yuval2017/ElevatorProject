import { animated, useSpring } from 'react-spring';
import '../styles/movingObjectStyles.css'

const MovingObject2 = ({ y , style, handleElevetorArrived}) => {
  // const spring = useSpring({
  //   to: { y },
  //   config: {
  //     duration: 3000, // set a longer duration for the animation
  //     tension: 70, // reduce the tension value to make the animation slower
  //     friction: 50, // increase the friction value to make the animation smoother
  //     onRest: () => {
  //       console.log("arrived")
  //     },
  //   },
  //   //config: {mass: 1, tension: 170, friction: 500, onRest: handleElevetorArrived() },
  // });
  const spring = useSpring({
    to: { y },
    config: {
      duration: 3000,
      tension: 70,
      friction: 50,
    },
    onRest: () => {
      window.requestAnimationFrame(() => {
        handleElevetorArrived();
      });
    },
  });
  
  return (
    <animated.div
      className="moving-object"
      style={{
        ...style,
        transform: spring.y.interpolate(y => `translateY(${y}px)`),
        
      }}
    />
  );
};

export default MovingObject2;