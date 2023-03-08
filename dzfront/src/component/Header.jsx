import React, { useState } from "react";
import '../css/header.css';
import Dropdown from "./DropDown";

const Header = () => {

  const[down, setDown] = useState(false);

  return (
    <div className="header"> 
    <ul onClick={() => {setDown(!down)}}>
       
       {down ? '★' : '☆'}
       {down && <Dropdown />}
     
      </ul>

    
    </div>
  );
};

export default Header;
