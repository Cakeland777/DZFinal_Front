import React from "react";
import { Link } from "react-router-dom";
import '../css/header.css';

const Header = () => {

  return (
    <div className="header"> 
       
      <Link  style={{ textDecoration: "none", color: 'white', margin: 5 ,fontWeight:'bold'}} to="/login">로그인</Link> | <Link  style={{ textDecoration: "none", color: 'white', margin: 5 ,fontWeight:'bold'}} to="/register">회원가입</Link> | 
      <Link  style={{ textDecoration: "none", color: 'white', margin: 5 ,fontWeight:'bold'}}  to="/registration">사업소득자등록</Link> |
      <Link  style={{ textDecoration: "none", color: 'white', margin: 5 ,fontWeight:'bold'}} to="/registration">사업소득자료입력</Link> | 
      <Link  style={{ textDecoration: "none", color: 'white', margin: 5 ,fontWeight:'bold'}} to="/earnerRead">사업소득조회</Link> | 
      
    </div>
  );
};

export default Header;
