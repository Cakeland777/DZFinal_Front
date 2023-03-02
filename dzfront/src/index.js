import React from 'react';

import './index.css';
import App from './App';
import { render } from "react-dom";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Login from './component/Login';
import Register from './component/Register';
import Header from './component/Header';
import Registration from './component/Registration';
import EarnerRead from './component/EarnerRead';
import FindAddr from './component/FindAddr';
import EarnDivRead from './component/EarnDivRead';
const rootElement = document.getElementById("root");
render(
  <BrowserRouter>
    <Header />
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="registration" element={<Registration />} />
      <Route path="earnerRead" element={<EarnerRead/>} />
      <Route path="earnDivRead" element={<EarnDivRead/>} />
      <Route path="findaddr" element={<FindAddr/>} />
    </Routes>
  </BrowserRouter>,
  rootElement
);