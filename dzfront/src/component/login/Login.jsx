import { Column } from "ag-grid-community";
import React, { useEffect,useState } from "react";
import { useNavigate } from 'react-router-dom';
import '../../css/login.css';
import Swal from 'sweetalert2';
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  function handleUsernameChange(event) {
    setUsername(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();

 
    fetch("http://localhost:8080/login.do", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        worker_id: username,
        worker_pw: password,
      }),
      
    })
      .then((response) => response.json())
      .then((data) => {
        if(data.isLogon===true){

          Swal.fire({
            title:data.member.memberVO.worker_id+"님 로그인되었습니다.",
            text:'환영합니다',
            icon:'success',

          });
         
          localStorage.setItem("memberInfo", data.member);
          localStorage.setItem("isLogOn", 1);
          navigate("/earnerRead");
      
      }
        else{
          Swal.fire({
            title:'로그인 실패',
            text:'정보를 확인해주세요',
            icon:'error',

          });
        

        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert('실패');
      });
  }


  return (
  

    <div className="App">
    <form onSubmit={handleSubmit} style={{ flexDirection:"Column"}}>
    <div className="input-container">
          <input type="text" placeholder="아이디" value={username} onChange={handleUsernameChange}/>
      
        </div>
        
        <div className="input-container">
          <input type="password"  value={password} onChange={handlePasswordChange} placeholder="비밀번호"/>
     
        </div>
        
        <button type="submit">로그인</button>
   
      </form>
      </div>
   
 
   

 
    
  );
}

export default Login;