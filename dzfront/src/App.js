import './App.css';

import { Route, Routes } from 'react-router-dom';
import Login from './component/login/Login'
import Model from './model/Model'
import Register from './component/Register';
import Header from './component/Header';
import EarnerGrid from './component/regist/EarnerGrid';
import Registration from './component/regist/Registration';
import EarnerRead from './component/list/EarnerRead';
import EarnDivRead from './component/list/EarnDivRead';
import IncomeInput from './component/input/IncomeInput';
import Test from './component/test';
import Home from './component/Home';

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
        <Route path="/incomeInput" element={<IncomeInput/>}/>
       
      </Routes>
    </div>

  </>
  );
 
};

export default App;

