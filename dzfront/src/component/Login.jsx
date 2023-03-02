
import {useNavigate} from 'react-router-dom';

const Login=() =>{
 
  const navigate = useNavigate();
 
  const home = () => {
    navigate("/");
  }; 
 
  return (

   
    <div>
      <h2>로그인</h2>
      <form>
    
        <input name="userid" placeholder='아이디' ></input>
        <br/>
        <input name="passwd" placeholder='비밀번호' ></input>
        <br/>
        <button>로그인</button>
        <button onClick={home}>돌아가기</button>
      </form>
     
    </div>
  );
}


export default Login;