
import React, { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import ko from 'date-fns/locale/ko';
import "react-datepicker/dist/react-datepicker.css";
const Register = () => {
  
    const [formList, setFormList] = useState([]); // 입력된 폼 데이터를 저장할 상태
  
    const handleSubmit = (formData) => {
      setFormList([...formList, formData]); // 입력된 폼 데이터를 상태에 추가
    };
  
    return (
      <div className="container">
        <Form onSubmit={handleSubmit} /> {/* 입력 폼 */}
        <FormList formList={formList} /> {/* 입력된 폼 데이터를 출력하는 폼 리스트 */}
      </div>
    );
  }
  
  function Form({ onSubmit }) {
    const [formData, setFormData] = useState({ name: '', email: '' }); // 입력한 데이터를 저장할 상태
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value }); // 입력된 값을 상태에 업데이트
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData); // 입력된 데이터를 상위 컴포넌트로 전달
      setFormData({ name: '', email: '' }); // 입력된 데이터를 초기화
    };
  
    return (
      <form onSubmit={handleSubmit}>
        
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} />
  
        <label htmlFor="email">Email:</label>
        <input type="text" id="email" name="email" value={formData.email} onChange={handleChange} />
  
        <button type="submit">Submit</button>
      </form>
    );
  }
  
  function FormList({ formList }) {
    return (
      <div>
        {formList.map((formData, index) => (
          <div key={index}>
            <table style={{border:"solid 1px black"}}>
            <tbody>
            <tr>
            <td>Name: {formData.name}</td>
            <td>Email: {formData.email}</td>
              </tr>
              </tbody>
            </table>
          </div>
        ))}
       
      </div>
    );
  }
  

export default Register;
