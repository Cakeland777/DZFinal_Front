import React,{useState} from 'react';
import '../modal.css';
const CodeModal = (props) => {
  
  const { open, close, header } = props;
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    props.onInputChange(inputValue);
    close();
  }
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

          <form onSubmit={handleSubmit}>
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


export default CodeModal;