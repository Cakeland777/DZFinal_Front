import './App.css';

import { Route, Link, Switch, Routes } from 'react-router-dom';
import Login from './component/Login'
import Model from './model/Model'

import Header from './component/Header';
import FindAddr from './component/FindAddr';
import Register from './component/Register';
import Registration from './component/Registration';
import EarnerRead from './component/EarnerRead';
import EarnDivRead from './component/EarnDivRead';

function App() {
  const [member, onLogin] = Model();
  return (
  <>
   <div>
      <Header/>
      <Routes>
        <Route path ="/login" element={<Login onLogin={onLogin}/>} />  
        <Route path="/register" element={Register} />
        <Route path="/registration" element={Registration} />
        <Route path="/earnerRead" element={EarnerRead} />
        <Route path="/earnDivRead" element={EarnDivRead} />
        <Route path="/findaddr" element={FindAddr} />
        <Route/>
      </Routes>
    </div>

  </>
  );
 
};

export default App;

