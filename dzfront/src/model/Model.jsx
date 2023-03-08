import  { useReducer } from 'react';
import { useNavigate } from 'react-router-dom';

  const MEMBER_ACTION = {
    LOGIN: 1
  };
  Object.freeze(MEMBER_ACTION);
  
  function memberReducer(member, action){
    switch(action.type){
      case MEMBER_ACTION.LOGIN:
          return {...member, memberInfo : action.memberInfo, login_status : action.login_status};  

      default:
        return member;
    }
  }
  
  export default function Model() {
    const [member, dispatch] = useReducer(memberReducer, {login_status : 0, memberInfo:{userid:'', passwd:''}});
    const navigate = useNavigate();

    const onLogin = (userid, passwd) => {
      fetch("http://localhost:8080/hello.do", { 
        method: "POST",
        headers : {"Content-type" : "application/json; charset=utf-8"},
        body: JSON.stringify({
          MEMBER_ID : userid,
          MEMBER_PW: passwd
        })
      })
      .then(response => response.json())
      .then(result => {
        if (result.isLogOn=== true) {
          dispatch({type : MEMBER_ACTION.LOGIN, memberInfo:result.member, login_status:1});
          alert(result.member.worker_id+"님 로그인되었습니다.");
          localStorage.setItem("memberInfo", result.member);
          localStorage.setItem("login_status", 1);
          //navigate("/"); 
        } else {
         alert(result.isLogOn);
        }
      });
    } 
        
    return [member, onLogin];
  }
