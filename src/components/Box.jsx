import React from "react";
import '../styles/boxStyles.css'

 function Box({key}) {
  return <div key = {key} className="box"></div>;
}

export default Box;