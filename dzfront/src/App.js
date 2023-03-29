import './App.css';

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

import IncomeInput2 from './component/input/IncomeInput2';
function App() {

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
        <Route path="/registPage" element={<RegistPage/>}/>
        <Route path="/calendar" element={<Calender/>}/>
        <Route path="/incomeInput2" element={<IncomeInput2/>}/>
      </Routes>
    </div>

  </>
  );
 
};

export default App;

