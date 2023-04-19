import { useState } from 'react';
import { useQueue } from '../context/Queue';

const useElevatorController = (elevatorCount, floorCount, elevatorHeight) => {
  const [buttonColors, setButtonColors] = useState(Array(floorCount).fill('green'));
  const { enqueue, size, dequeue } = useQueue();

  // Set button color
  const setButtonColor = (buttonIndex, color) => {
    setButtonColors((prevButtonColors) => {
      const newButtonColors = [...prevButtonColors];
      newButtonColors[buttonIndex] = color;
      return newButtonColors;
    });
  };

  // Choose the closest available elevator
  const chooseTheClosestElevator = (toFloor, elevatorsData) => {
    const availableElevators = elevatorsData.filter(elevator => !elevator.occupied);
    if (availableElevators.length === 0) {
      return undefined;
    }
    let closestElevator = availableElevators[0];
    let closestDistance = Math.abs(availableElevators[0].currFloor - toFloor);
    for (const object of availableElevators) {
      const distance = Math.abs(object.currFloor - toFloor);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestElevator = object;
      }
    }
    return closestElevator;
  };

  // Handle elevator arrival at a floor
  const handleElevatorArrived = (elevatorId, buttonNum, elevatorsData) => {
    return () => {
      const optionalFloorTo = dequeue();
      // Set button color to blue
      setButtonColor(buttonNum, 'blue');
      // Wait 2 secs
      setTimeout(() => {
        // If there is another floor waiting for the elevator
        if (optionalFloorTo !== undefined) {
          setButtonColor(buttonNum, 'red');
          setButtonColor(optionalFloorTo, 'red');
          setElev
          atorsData(prevData => (prevData.map(data => {
            if (data.key === elevatorId) {
              return {
                ...data,
                handleElevatorArrived: handleElevatorArrived(data.key, optionalFloorTo, elevatorsData),
                currFloor: buttonNum,
                toFloor: optionalFloorTo,
                y: -(elevatorHeight - 2) * optionalFloorTo,
              };
            } else {
              return data;
            }
          })));
        } else { // Elevator is unoccupied and waiting for reservation
          setElevatorsData(prevData => (prevData.map(data => {
            if (data.key === elevatorId) {
              return {
                ...data,
                currFloor: buttonNum,
                toFloor: -1,
                occupied: false,
              };
            } else {
              return data;
            }
          })));
        }
        setButtonColor(buttonNum, 'green');
      }, 2000);
    };
  };

  // Handle elevator reservation request
  const handleElevatorReservation = (floorIndex, elevatorsData) => {
    // Do nothing if the button is red or waiting
    if (buttonColors[floorIndex] !== 'green') {
      return;
    }
    let elevator;
    // If all the elevators are full, put the floor on pending queue
    if (size() > 0 || (elevator = chooseTheClosestElevator(floorIndex, elevatorsData)) === undefined) {
      enqueue(floorIndex);
      setButtonColor(floorIndex, 'red');
    } else { // Choose closest available elevator
      const elevatorNumber = elevator.key;
      // Stay on the floor
      if (elevator.currFloor === floorIndex) {
        setButtonColor(floorIndex, 'blue');
        setTimeout(() => setButtonColor(floorIndex, 'green'), 2000);
      } else { // Move to the floor
        setButtonColor(floorIndex, 'red');
        setElevatorsData(prevData => (prevData.map(data => {
          const oldFloor = data.currFloor;
          if (data.key === elevatorNumber) {
            return {
              ...data,
              handleElevatorArrived: handleElevatorArrived(data.key, floorIndex, elevatorsData),
              currFloor: oldFloor,
              toFloor: floorIndex,
              occupied: true,
              y: -(elevatorHeight - 2) * floorIndex,
            };
          } else {
            return data;
          }
        })));
      }
    }
  };

  return {
    buttonColors,
    handleElevatorReservation,
    handleElevatorArrived,
    elevatorsData,
    chooseTheClosestElevator,
  };
};

export default useElevatorController;
