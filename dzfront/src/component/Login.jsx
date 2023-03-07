import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
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

 
    fetch("http://localhost:8080/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        MEMBER_ID: username,
        MEMBER_PW: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if(data.isLogOn===true){
          alert(data.member.worker_id+"님 로그인되었습니다.");
          localStorage.setItem("memberInfo", data.member);
          localStorage.setItem("isLogOn", 1);
          navigate("/registration");
      
      }
        else{
          alert('실패');

        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert('실패');
      });
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        아이디:
        <input type="text" value={username} onChange={handleUsernameChange} />
      </label>
      <br/>
      <label>
       비밀번호:
        <input type="password" value={password} onChange={handlePasswordChange} />
      </label>
      <br/>
      <button type="submit">로그인</button>
    </form>
  );
}

export default Login;