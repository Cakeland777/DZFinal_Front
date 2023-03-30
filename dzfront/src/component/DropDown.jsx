import { Link } from "react-router-dom";
import React,{useEffect} from 'react';
import '../css/dropDown.css';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
function Dropdown() {
  const[isLogin,setIsLogin]=React.useState(false);

  useEffect(()=>{
   let status=localStorage.getItem("isLogon");
    if(status==="1"){
      setIsLogin(true);
    }else{
      setIsLogin(false);
    }
    }
  );
  const navigate = useNavigate();
  const logOut=()=>{
    
      localStorage.clear();
      navigate("/login");
      Swal.fire({
        title:"로그아웃되었습니다",
        text:'',
        icon:'success',
  
      });
    };
  
if(isLogin){
  return (
    <div className="linkMenu" >
       <li><button onClick={logOut}>로그아웃</button></li>
       <li><Link  style={{ textDecoration: "none", color: 'white', margin: 5 ,fontWeight:'bold'}}  to="/registration">사업소득자등록</Link></li>
       <li><Link  style={{ textDecoration: "none", color: 'white', margin: 5 ,fontWeight:'bold'}} to="/earnerRead">사업소득조회</Link></li>
       <li><Link  style={{ textDecoration: "none", color: 'white', margin: 5 ,fontWeight:'bold'}} to="/test">테스트</Link></li>
    <li><Link  style={{ textDecoration: "none", color: 'white', margin: 5 ,fontWeight:'bold'}} to="/codeconversion">코드변환</Link></li>
    <li><Link  style={{ textDecoration: "none", color: 'white', margin: 5 ,fontWeight:'bold'}} to="/test2">테스트2</Link></li>
    <li><Link  style={{ textDecoration: "none", color: 'white', margin: 5 ,fontWeight:'bold'}} to="/register">회원가입</Link></li>
    <li><Link  style={{ textDecoration: "none", color: 'white', margin: 5 ,fontWeight:'bold'}} to="/registPage">사업소득자등록</Link></li>
    <li><Link  style={{ textDecoration: "none", color: 'white', margin: 5 ,fontWeight:'bold'}} to="/incomeInput2">사업소득자료입력2</Link></li> 
    <li><Link  style={{ textDecoration: "none", color: 'white', margin: 5 ,fontWeight:'bold'}} to="/calendar">캘린더</Link></li>

    </div>
  );}
  return(
    <div className="linkMenu">
             <li><Link  style={{ textDecoration: "none", color: 'white', margin: 5 ,fontWeight:'bold'}}  to="/registration">사업소득자등록</Link></li>
       <li><Link  style={{ textDecoration: "none", color: 'white', margin: 5 ,fontWeight:'bold'}} to="/earnerRead">사업소득조회</Link></li>
    <li><Link  style={{ textDecoration: "none", color: 'white', margin: 5 ,fontWeight:'bold'}} to="/login">로그인</Link></li>
    <li><Link  style={{ textDecoration: "none", color: 'white', margin: 5 ,fontWeight:'bold'}} to="/test">테스트</Link></li>
    <li><Link  style={{ textDecoration: "none", color: 'white', margin: 5 ,fontWeight:'bold'}} to="/test2">테스트2</Link></li>
    <li><Link  style={{ textDecoration: "none", color: 'white', margin: 5 ,fontWeight:'bold'}} to="/register">회원가입</Link></li>
    <li><Link  style={{ textDecoration: "none", color: 'white', margin: 5 ,fontWeight:'bold'}} to="/registPage">사업소득자등록</Link></li>
    <li><Link  style={{ textDecoration: "none", color: 'white', margin: 5 ,fontWeight:'bold'}} to="/incomeInput2">사업소득자료입력2</Link></li> 
    <li><Link  style={{ textDecoration: "none", color: 'white', margin: 5 ,fontWeight:'bold'}} to="/calendar">캘린더</Link></li>
    </div>
  )
}

export default Dropdown;