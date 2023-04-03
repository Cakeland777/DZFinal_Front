import { Column } from "ag-grid-community";
import React, { useEffect,useState } from "react";
import { useNavigate } from 'react-router-dom';
import '../../css/login.css';
import Swal from 'sweetalert2';
function Login(props) {
  props.setTitle("로그인");
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
            title:data.MemberVO.worker_id+"님 로그인되었습니다.",
            text:'환영합니다',
            icon:'success',

          });
         
          localStorage.setItem("memberInfo", data.member);
          localStorage.setItem("worker_id", data.MemberVO.worker_id);
          localStorage.setItem("code_count", data.MemberVO.code_count);
          localStorage.setItem("isLogon", 1);
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
    
  }


  return (
    <div class="container"style={{backgroundImage:`url('/desk.jpg')`,backgroundRepeat:"no-repeat", 
   backgroundSize:"cover",backgroundAttachment:"fixed" }} >
 
      <div class="display" style={{width:"500px",height:"1000px",marginLeft:"1500px",float:"right"}}>
      <form onSubmit={handleSubmit} style={{ flexDirection:"Column"}}>
        <div class="display_content">
          
          <div class="login_form">
          <img src="/BizLogo.png" style={{width:"300px",float:"left",height:"200px"}}></img>

            <div class="login_field">
              <input
                type="text"
                class="login_input"
                value={username} onChange={handleUsernameChange}
                placeholder="아이디"
              ></input>
            </div>
            <div class="login_field">
              <input
                type="password"
                value={password} onChange={handlePasswordChange}
                class="login_input"
                placeholder="비밀번호"
              ></input>
            </div>
            <button  type="submit" className="login_submit">로그인</button>
            </div>
      
        </div>
        </form>
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
