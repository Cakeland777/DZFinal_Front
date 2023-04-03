import './App.css';
import {withRouter} from "react-router-dom";
import {useEffect,useState} from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './component/login/Login';
import Calender from './component/Calendar';
import Register from './component/Register';
import Header from './component/Header';
import EarnerGrid from './component/regist/EarnerGrid';
import Registration from './component/regist/Registration';
import EarnerRead from './component/list/EarnerRead';
import EarnDivRead from './component/list/EarnDivRead';
import Test from './component/test';
import Home from './component/Home';
import RegistPage from './component/regist/RegistPage';
import CodeConversion from './component/util/CodeConversion';
import IncomeInput2 from './component/input/IncomeInput2';
function App() {
// const navigate = useNavigate();

  // useEffect(() => {
  //   let status = localStorage.getItem("isLogOn");
  //   if (status === "1") {
  //     const timeoutId = setTimeout(() => {
  //       localStorage.clear();
  //     }, 500 * 60 * 1000); // 5분 = 5 * 60 * 1000 밀리초
  //     return () => clearTimeout(timeoutId);
  //   } else {
  //     navigate('/login');
  //   }
  // }, [navigate]);
const [title,setTitle] =useState();
  return (
  <>
   <div>
      <Header title={title}/>
      <Routes>
        <Route path="/" element={<Home setTitle={setTitle}/>} />
        <Route path ="/login" element={<Login setTitle={setTitle}/>} />  
        <Route path="/register" element={<Register />} />
        <Route path="/registration" element={<Registration/>} />
        <Route path="/earnerRead" element={<EarnerRead setTitle={setTitle}/>}  />
        <Route path="/earnDivRead" element={<EarnDivRead setTitle={setTitle}/>} />  
        <Route path="/test" element={<Test/>} />
        <Route path="/codeconversion" element={<CodeConversion setTitle={setTitle}/>} />
        <Route path="/test2" element={<EarnerGrid />} />
        <Route path="/registPage" element={<RegistPage setTitle={setTitle}/>}/>
        <Route path="/calendar" element={<Calender/>}/>
        <Route path="/incomeInput2" element={<IncomeInput2 setTitle={setTitle}/>}/>
      </Routes>
    </div>

  </>
  );
 
};

export default App;

