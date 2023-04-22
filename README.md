# Elevator Exercise

## Description
This project is a simulation of an elevator system that allows users to call and ride elevators between multiple floors. The project is built using React and several libraries, including `react-spring` and `Bootstrap`.

## Installation
To install the required libraries for this project, run the following commands in your terminal:

<pre>
<code>
npm install react-spring
npm install react-bootstrap bootstrap
</code>
</pre>


## Project Structure
The project directory is structured as follows:


- root
  - src
    - components
      - Board.jsx
      - CountTimer.jsx
      - Elevator.jsx
      - Floor.jsx
    - constants
      - config.jsx
      - constants.jsx
    - context
      - elevatorController.jsx
      - floorContoller.jsx
      - playMusic.jsx
      - Queue.jsx
    - styles
      - boardStyles.css
      - elevatorStyles.css
      - floorStyles.css
      - timerStyles.css
    - App.jsx
  - public
    - index.html
   

## Configuration
The `config.jsx` file defines the number of elevators and the number of floors for the simulation.

## Controllers
There are two controller components that manage the elevator and floor functionality:

### `elevatorController.jsx`
This component controls the elevators in the simulation. It brings an available elevator to the requested floor if there is one, and handles the animation of moving the elevators using the `react-spring` library.

### `floorController.jsx`
This component handles the buttons and time slots for each floor. When a button is pressed, the nearest elevator is called to the floor. If there are no available elevators, the floor is added to a queue.

## Board
The `Board.jsx` component serves as a facade between the elevator and floor controllers.

## Elevator
The `Elevator.jsx` component is responsible for moving between floors. When an elevator is called, it turns red. When it arrives at a requested floor, it plays a sound, waits for 2 seconds, and then either goes to the next requested floor or waits for new calls.

## Floor
The `Floor.jsx` component allows users to call elevators and displays the estimated time for the nearest elevator to reach the floor. When an elevator becomes available, it will automatically reach the floor that has been waiting the longest.

## Styles
The `styles` folder contains CSS files for styling the different components.

## Resources
- `react-spring` library documentation: https://www.react-spring.io/
- `Bootstrap` documentation: https://getbootstrap.com/docs/5.1/getting-started/introduction/
- `React` documentation: https://reactjs.org/docs/getting-started.html





