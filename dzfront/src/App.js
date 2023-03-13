import './App.css';

import { Route, Routes } from 'react-router-dom';
import Login from './component/Login'
import Model from './model/Model'
import Register from './component/Register';
import Header from './component/Header';
import FindAddr from './component/FindAddr';
import Test2 from './component/test2';
import Registration from './component/Registration';
import EarnerRead from './component/EarnerRead';
import EarnDivRead from './component/EarnDivRead';
import IncomeInput from './component/IncomeInput';
import Test from './component/test';
import Home from './component/Home';
function App() {
  
  const [member, onLogin] = Model();
  return (
  <>
   <div>
      <Header/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path ="/login" element={<Login onLogin={onLogin}/>} />  
        <Route path="/register" element={<Register/>} />
        <Route path="/registration" element={<Registration/>} />
        <Route path="/earnerRead" element={<EarnerRead/>} />
        <Route path="/earnDivRead" element={<EarnDivRead/>} />
        <Route path="/findaddr" element={<FindAddr/>} />
        <Route path="/test" element={<Test/>} />
        <Route path="/test2" element={<Test2/>} />
        <Route path="/incomeInput" element={<IncomeInput/>}/>
       
      </Routes>
    </div>

  </>
  );
 
};

export default App;

