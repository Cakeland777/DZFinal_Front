import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
function MyForm() {
  const [rowData,setRowData] = useState([
    {make: "Toyota", model: "Celica", price: 35000,editable: true },
    {make: "Ford", model: "Mondeo", price: 32000,editable: true },
    {make: "Porsche", model: "Boxster", price: 72000,editable: true }
]);

const [columnDefs] = useState([
    { field: 'make' },
    { field: 'model' },
    { field: 'price' }
])

  const [isArtist, setIsArtist] = useState('');
  const [name, setName] = useState('');
 
  const [selectedOption, setSelectedOption] = useState("");
  const handleBlur = (event) => {
    const { name, value } = event.target;
    if (value.trim() !== '') {
      fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          patch_value: value,
          patch_param :name,
          worker_id:localStorage.getItem("worker_id"),
          earner_code:"000001"
        
        }),
      })
        .then((response) => {
          // handle response
        })
        .catch((error) => {
          // handle error
        });
    }
  };
 
  const handleSubmit = (event) => {
    event.preventDefault();
    // handle form submit
  };
  function handleChange2(event) {
    setSelectedOption(event.target.value);
  }
  function handleChange(event) {
    setIsArtist(event.target.value);
  }
  function handleChange1(event) {
    setName(event.target.value);
  }
  return (
    <><div>
      <form onSubmit={handleSubmit} style={{float:"left"}}>
        예술인 <input type="text" name="isArtist" value={isArtist} onBlur={handleBlur} onChange={handleChange} />
        이름 <input type="text" name="name" value={name} onChange={handleChange1} onBlur={handleBlur} />
        기준
        <select value={selectedOption} name="type" onBlur={handleBlur} onChange={handleChange2}>
          <option value="accural_ym">1.귀속년월</option>
          <option value="payment_ym">2.지급년월</option>
        </select>
        <button type="submit">Submit</button>
      </form>
    </div><div className="ag-theme-alpine" style={{ height: 400, width: 600 ,float:"left"}}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}>
        </AgGridReact>
      </div></>
  );
}

export default MyForm;