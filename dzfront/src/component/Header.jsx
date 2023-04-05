import React, { useState,useCallback ,useEffect} from "react";
import { Link,useNavigate} from "react-router-dom";
import '../css/header.css';

import Swal from 'sweetalert2';


  
function Head(props) {
  const isDeleteButtonVisible = props.title === '사업소득자등록' || props.title === '사업소득자료입력';
 
  return (
    <div className="header">
    <ul className="menu simple float-right" style={{ display: 'flex', alignItems: 'flex-start' }}>
      <li>
        <button
          type="button"
          className={`button small ${props.isMenuOpen ? 'hide' : ''}`}
          onClick={props.onMenuToggle}
          style={{ marginRight: 10, height: 40,backgroundColor:"#3B42BF" }}
         
        >
          B
        </button>
      </li>
      
      <li style={{ marginLeft: 0,whiteSpace:"nowrap",marginTop:"15px"}}><b>{props.title}</b></li>
      {isDeleteButtonVisible &&
        <li>
          <button
            type="button"
            className={`button small ${props.isMenuOpen ? 'hide' : ''}`}
            onClick={props.onMenuToggle}
            style={{ marginRight: 10, height: 40,marginLeft:1500 }}
          >
            삭제
          </button>
        </li>
      }
    </ul>
  </div>
  );
};






function Menu(props) {
  const[isLogin,setIsLogin]=React.useState(false);
  useEffect(()=>{
    let status=localStorage.getItem("isLogon");
     if(status==="1"){
       setIsLogin(true);
     }else{
       setIsLogin(false);
     }
     },[]);
   const navigate = useNavigate();
   const handleLinkClick = () => {
    props.onMenuToggle(false); // 사이드바 닫기
  };
   const logOut = () => {
    navigate("/login");
     localStorage.clear();
     handleLinkClick();
     Swal.fire({
       title: "로그아웃되었습니다",
       text: "",
       icon: "success",
     });
 
     
   };
     if(isLogin){
  return (
    
    <div className={`sidebar-menu ${props.isMenuOpen ? 'open' : ''}` }> 
   
      <ul className="vertical menu">
      <div className="linkMenu">
       <li><Link  style={{ textDecoration: "none", color: 'white', margin: 5 ,fontWeight:'bold'}} to="/earnerRead"   onClick={handleLinkClick}>사업소득조회</Link></li>
    <li><Link  style={{ textDecoration: "none", color: 'white', margin: 5 ,fontWeight:'bold'}} onClick={logOut} >로그아웃</Link></li>
    <li><Link  style={{ textDecoration: "none", color: 'white', margin: 5 ,fontWeight:'bold'}} to="/test"   onClick={handleLinkClick}>테스트</Link></li>
    <li><Link  style={{ textDecoration: "none", color: 'white', margin: 5 ,fontWeight:'bold'}} to="/test2"   onClick={handleLinkClick}>테스트2</Link></li>
    <li><Link  style={{ textDecoration: "none", color: 'white', margin: 5 ,fontWeight:'bold'}} to="/register"   onClick={handleLinkClick}>회원가입</Link></li>
    <li><Link  style={{ textDecoration: "none", color: 'white', margin: 5 ,fontWeight:'bold'}} to="/registPage"   onClick={handleLinkClick}>사업소득자등록</Link></li>
    <li><Link  style={{ textDecoration: "none", color: 'white', margin: 5 ,fontWeight:'bold'}} to="/incomeInput2"   onClick={handleLinkClick}>사업소득자료입력2</Link></li>
    <li><Link  style={{ textDecoration: "none", color: 'white', margin: 5 ,fontWeight:'bold'}} to="/codeconversion"   onClick={handleLinkClick}>코드변환</Link></li> 
 
    </div>
      </ul>
    </div>
  );
}
return (
    
  <div className={`sidebar-menu ${props.isMenuOpen ? 'open' : ''}` }> 
 
    <ul className="vertical menu">
    <div className="linkMenu">

  <li><Link  style={{ textDecoration: "none", color: 'white', margin: 5 ,fontWeight:'bold'}} to="/login"  onClick={handleLinkClick}>로그인</Link></li>
 
  </div>
    </ul>
  </div>
);

}

  function Header(props) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const toggleMenu = useCallback(() => {
      setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);
    }, []);
 

    return (
      <div className="app-container">
        <Head onMenuToggle={toggleMenu} title={props.title} />
        <Menu isMenuOpen={isMenuOpen} onMenuToggle={toggleMenu} />
      </div>
    );
  };


export default Header;
