import React from 'react';
import '../modal.css';
import FindAddr from './FindAddr';
const Modal = (props) => {
  
  const { open, close, header } = props;

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
          <main>{props.children}  <FindAddr></FindAddr></main>
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


export default Modal;