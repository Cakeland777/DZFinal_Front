import React,{useState} from 'react';
import '../modal.css';
import { render } from 'react-dom';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
const DivCodeModal = (props) => {
  const [rowData] = useState([
    {make: "Toyota", model: "Celica", price: 35000},
    {make: "Ford", model: "Mondeo", price: 32000},
    {make: "Porsche", model: "Boxster", price: 72000}
]);

const [columnDefs] = useState([
    { field: 'make' },
    { field: 'model' },
    { field: 'price' }
])
  const { open, close, header } = props;
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    props.onInputChange(inputValue);
    close();
  }

  const [searchTerm, setSearchTerm] = useState("");
const [suggestions, setSuggestions] = useState([]);

const handleChange = (event) => {
  const value = event.target.value;
  setSearchTerm(value);

  // API 호출하여 suggest 검색 결과를 가져옴
  fetch(`/api/suggest?q=${value}`)
    .then((response) => response.json())
    .then((data) => setSuggestions(data));
};
  return (
    
    <div className={open ? 'openModal modal' : 'modal'}>
      {open ? (
        <section>
          <header>
            {header}
            <button className="close" onClick={close}>
              &times;
            </button>
          </header>
          <main> 
          <ul>
  {suggestions.map((item) => (
    <li key={item.id}>{item.text}</li>
  ))}
</ul>
          <form onSubmit={handleSubmit}>
          <input type="text" value={searchTerm} onChange={handleChange} />
        <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
        <button type="submit">확인</button>
      </form>
      </main>
          <footer>
            <button className="close" onClick={close}>
              close
            </button>
          </footer>
        </section>
      ) : null}
    </div>
  );
};


export default DivCodeModal;