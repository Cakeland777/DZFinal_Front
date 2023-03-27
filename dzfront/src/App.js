import './App.css';

import { Route, Routes, useHistory, useNavigate  } from 'react-router-dom';
import Login from './component/login/Login'
import Model from './model/Model'
import Register from './component/Register';
import Header from './component/Header';
import EarnerGrid from './component/regist/EarnerGrid';
import Registration from './component/regist/Registration';
import EarnerRead from './component/list/EarnerRead';
import EarnDivRead from './component/list/EarnDivRead';
import IncomeInput from './component/input/IncomeInput';
import {useEffect} from 'react';
import Test from './component/test';
import Home from './component/Home';
import Calender from './component/Calendar';

function App() {
  const navigate = useNavigate();

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

  return (
  <>
   <div>
      <Header/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path ="/login" element={<Login />} />  
        <Route path="/register" element={<Register/>} />
        <Route path="/registration" element={<Registration/>} />
        <Route path="/earnerRead" element={<EarnerRead/>} />
        <Route path="/earnDivRead" element={<EarnDivRead/>} />
        <Route path="/test" element={<Test/>} />
        <Route path="/test2" element={<EarnerGrid/>} />
        <Route path="/incomeInput" element={<IncomeInput/>}/>
        <Route path="/calendar" element={<Calender/>}/>
       
      </Routes>
    </div>

  </>
  );
 
}


export default App;

