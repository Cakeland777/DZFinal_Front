import './App.css';
import { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

import Login from './component/login/Login';
import Calender from './component/Calendar';
import Header from './component/Header';
import EarnerGrid from './component/regist/EarnerGrid';
import EarnerRead from './component/list/EarnerRead';
import EarnDivRead from './component/list/EarnDivRead';
import Test from './component/test';
import Home from './component/Home';
import RegistPage from './component/regist/RegistPage';
import CodeConversion from './component/util/CodeConversion';
import IncomeInput2 from './component/input/IncomeInput2';

function App() {

  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    let status = localStorage.getItem("isLogon");
    if (status === "1") {
      setIsLogin(true);
      const timeoutId = setTimeout(() => {
        localStorage.clear();
      }, 5 * 60 * 1000); // 5분 = 5 * 60 * 1000 밀리초
      return () => clearTimeout(timeoutId);

    } else {

      navigate('/login');
      setIsLogin(false);


    }
  }, [navigate]);

  const [title, setTitle] = useState();
  const [earnerCodes, setEarnerCodes] = useState();
  const [paymentYm, setPaymentYm] = useState();
  return (
    <>
      <div>

        <Header title={title} earnerCodes={earnerCodes} paymentYm={paymentYm} isLogin={isLogin} />
        <Routes>
          <Route path="/" element={<Home setTitle={setTitle} />} />
          <Route path="/login" element={<Login setTitle={setTitle} setIsLogin={setIsLogin} />} />
          <Route path="/earnerRead" element={<EarnerRead setTitle={setTitle} />} />
          <Route path="/earnDivRead" element={<EarnDivRead setTitle={setTitle} />} />
          <Route path="/test" element={<Test />} />
          <Route path="/codeconversion" element={<CodeConversion setTitle={setTitle} />} />
          <Route path="/test2" element={<EarnerGrid />} />
          <Route path="/registPage" element={<RegistPage setTitle={setTitle} setEarnerCodes={setEarnerCodes} />} />
          <Route path="/calendar" element={<Calender />} />
          <Route path="/incomeInput2" element={<IncomeInput2 setTitle={setTitle} setEarnerCodes={setEarnerCodes} setPaymentYm={setPaymentYm} />} />
        </Routes>
      </div>

    </>
  );

};

export default App;

