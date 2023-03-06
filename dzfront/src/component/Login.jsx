import { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import '../css/login.css';

const Login=({member, onLogin}) =>{

  const navigate = useNavigate();
 
  const [userid, setUserid] = useState('')
  const [passwd, setPasswd] = useState('')

  const handleUserid = (e) => {
    setUserid(e.target.value);
}

const handlePasswd = (e) => {
    setPasswd(e.target.value);
}

  const onClickLogin = () => {
    console.log('click_login');
    onLogin(userid, passwd);
}

  const home = () => {
    navigate("/");
  }; 
 
  return (

   
    <div>
      <h2>로그인</h2>
      <form className='box' >
    
        <input type='text' name="userid" value={userid} placeholder='아이디' onChange={handleUserid} ></input>
        <br/>
        <input type='password' name="passwd" value={passwd} placeholder='비밀번호' onChange={handlePasswd}></input>
        <br/>
        <button onClick={onClickLogin}>로그인</button>
        <button onClick={home}>돌아가기</button>
      </form>
     
    </div>
  );
}


export default Login;