import './App.css';

import { Route, Link, Switch } from 'react-router-dom';
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
      <Switch>
        <Route path ="/login" component={<Login onLogin={onLogin}/>} />  
        <Route path="/register" component={Register} />
        <Route path="/registration" component={Registration} />
        <Route path="/earnerRead" component={EarnerRead} />
        <Route path="/earnDivRead" component={EarnDivRead} />
        <Route path="/findaddr" component={FindAddr} />
        <Route/>
      </Switch>
    </div>

  </>
  );
 
};

export default App;

