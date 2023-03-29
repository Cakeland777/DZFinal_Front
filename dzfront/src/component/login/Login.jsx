import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../../css/login.css";


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
        if (data.isLogOn === true) {
          Swal.fire({
            title: data.member.worker_id + "님 로그인되었습니다.",
            text: "환영합니다",
            icon: "success",
          });

          localStorage.setItem("worker_id", data.member.worker_id);
          localStorage.setItem("code_count", data.member.code_count);
          localStorage.setItem("isLogOn", 1);
          navigate("/");
        } else {
          Swal.fire({
            title: "로그인 실패",
            text: "정보를 확인해주세요",
            icon: "error",
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("실패");
      });
  }

  return (
    <div class="container"style={{backgroundImage:`url('/desk.jpg')`,backgroundRepeat:"no-repeat", 
   backgroundSize:"cover",backgroundAttachment:"fixed" }} >
      <div class="display" style={{width:"500px",height:"1000px",marginLeft:"1500px"}}>
        <div class="display_content">
          <div class="login_form">
            <div class="login_field">
              <input
                type="text"
                class="login_input"
                placeholder="아이디"
              ></input>
            </div>
            <div class="login_field">
              <input
                type="password"
                class="login_input"
                placeholder="비밀번호"
              ></input>
            </div>
            <button class="login_submit">로그인</button>
          </div>
        </div>
        <div className="display_background">
       
          <span class="display_background_shape display_background_shape4"></span>
          <span class="display_background_shape display_background_shape3"></span>
          <span class="display_background_shape display_background_shape2"></span>
          <span class="display_background_shape display_background_shape1"></span>
        </div>
      </div>
    </div>
  );
}

export default Login;
