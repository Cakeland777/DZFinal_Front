import { Link } from "react-router-dom";
import React from 'react';
import '../css/dropDown.css';

function Dropdown() {

  return (
    <div className="linkMenu" >
      
       <li><Link  style={{ textDecoration: "none", color: 'white', margin: 5 ,fontWeight:'bold'}} to="/login">로그인</Link></li>
       <li><Link  style={{ textDecoration: "none", color: 'white', margin: 5 ,fontWeight:'bold'}} to="/register">회원가입</Link></li>
       <li><Link  style={{ textDecoration: "none", color: 'white', margin: 5 ,fontWeight:'bold'}}  to="/registration">사업소득자등록</Link></li>
       <li><Link  style={{ textDecoration: "none", color: 'white', margin: 5 ,fontWeight:'bold'}} to="/">사업소득자료입력</Link></li> 
       <li><Link  style={{ textDecoration: "none", color: 'white', margin: 5 ,fontWeight:'bold'}} to="/earnerRead">사업소득조회</Link></li>
     
    </div>
  );
}

export default Dropdown;