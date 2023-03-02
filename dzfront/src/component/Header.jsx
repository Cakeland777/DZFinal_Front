import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div> 
      <Link to="/login">로그인</Link> | <Link to="/register">회원가입</Link> | 
       <Link to="/registration">사업소득자등록</Link> |
       <Link to="/registration">사업소득자료입력</Link> | 
       <Link to="/earnerRead">사업소득조회</Link> | 
    </div>
  );
};

export default Header;
