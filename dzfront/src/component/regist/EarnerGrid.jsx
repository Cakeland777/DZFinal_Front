import React, {  useCallback, useContext, useRef,useState,useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import ReactModal, { contextType } from "react-modal";
import DivCodeButton from "../util/DivCodeButton";
import Registration from "./Registration";
import MyContext from "../util/Context";
  const EarnerGrid = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const gridRef = useRef();
    const gridRef2 = useRef();
    const columnDefs = [ 
      
      { headerName: "Code", field: "earner_code",editable:true,width:90 },
      { headerName: "소득자명", field: "earner_name", editable: true,width:90 },

      {
        headerName: "주민(외국인)번호",
        children: [
            { headerName: "구분",field: 'is_native' ,editable:true,width:60},
            { headerName: "번호",field: 'personal_no',width:150,editable:true,colspan:2},
        ]
    },
    {

      headerName: '소득구분',
      children: [
          { headerName: "구분코드",field: 'div_code' ,width:90},
          { headerName: "구분명",field: 'div_name',width:100,colspan:2},
          {
            headerName: "",
            field: "buttonColumn",
            editable:true,
            width:100,
            cellRenderer: (params) => {
              const handleClick = () => {
                setIsModalOpen(true);
              };
              return <button style={{height:"20px",width:"10px",zIndex:"-100"}}onClick={handleClick}>.</button>;
            },
          },
      ]
  },
 
      ];
      const divColumn = [
          { headerName: "소득구분코드", field: "div_code",width:180 },
          { headerName: "소득구분명", field: "div_name", width:160 },
                    
        ];

      const emptyRowData = { code: "000001", name: "", number: "", div: "" };
      
    const [rowData, setRowData] = useState();
    const [divRowData, setDivRowData] = useState();
 
  const onGridReady = useCallback((params) => {
    fetch('http://localhost:8080/list_divcode')
      .then((resp) => resp.json())
      .then((data) => setDivRowData(data.div_list));
  }, []);
    const handleCellEditingStopped = ({ data, colDef }) => {
      if (colDef.field === "name") {
        fetch(`http://localhost:8080/get_count`)
          .then((response) => response.json())
          .then((data) => {
            const newRowData = { ...data, name: data.name || data.code };
            const newData = [...rowData];
            newData[data.rowIndex] = newRowData;
            setRowData(newData);
            createNewRow();
          })
          .catch((error) => {
            console.error("Error fetching code:", error);
          });
      }
    };
    useEffect(() => {
      fetch(`http://localhost:8080/earner_list/yuchan2`)
      .then(result => result.json())
      .then((rowData) =>{ 
        setRowData(rowData.earner_list);   
       
       }
        )
   }, []);
   
    const createNewRow = () => {
      const lastRowData = rowData[rowData.length - 1];
      const isLastRowFilled = Object.values(lastRowData).every((val) => val !== "");
      if (isLastRowFilled) {
        setRowData([...rowData, emptyRowData]);
      }
    };
  
    const handleSubmit = () => {
      
      const lastRowData = rowData[rowData.length - 1];
      const isLastRowFilled = Object.values(lastRowData).every((val) => val !== "");
      if (isLastRowFilled) {
        // 모든 값이 입력되었는지 확인
        const isAllFilled = rowData.every((data) =>
          Object.values(data).every((val) => val !== "")
        );
  
        if (isAllFilled) {
          // 서버로 데이터 전송
          fetch("http://example.com/api/data", {
            method: "POST",
            body: JSON.stringify(rowData),
            headers: {
              "Content-Type": "application/json"
            }
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Failed to send data to server.");
              }
              return response.json();
            })
            .then((data) => {
              console.log("Data sent to server:", data);
            })
            .catch((error) => {
              console.error("Error sending data to server:", error);
            });
  
          // 새로운 행 생성
          setRowData([emptyRowData]);
        }
      }
    };
   
    
    const DivModalDoubleClicked=useCallback(() => {
      const selectedRows = gridRef.current.api.getSelectedRows();

      setIsModalOpen(false);
      
      console.log("selectValue->", selectedRows[0]);
      setRowData([{...rowData[0], name : selectedRows[0].div_code, number: "aaaaaa"}]);
      gridRef2.current.api.applyTransaction({ add: [{ code: "", name: "", number: "", div: "" }] });
      
    }, []);
    const[selectValue, setSelectValue]=useState("");
    
    const onSelectionChanged = useCallback(() => {
      const selectedRows = gridRef.current.api.getSelectedRows();
      setSelectValue(selectedRows[0]);
      document.querySelector('#div_name').innerHTML =
        selectedRows.length === 1 ? selectedRows[0].div_code : '';
        
    }, []);

    const onSelectionChanged2 = useCallback(() => {
      const selectedRows2 = gridRef2.current.api.getSelectedRows();
      sessionStorage.setItem("code",selectedRows2[0].earner_code);
        
    }, []);
    const customStyles = {
      content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
      },
    };

    // const fetchData = (code) => {
    //   fetch(`http://localhost:8080/get_earner?earner_code=${code}&worker_id=yuchan2`, {
    //         method: "GET",
    //         headers: {
    //           "Content-Type": "application/json"
    //         }
    //       })
    //       .then((res) => {
    //         return res.json(); 
    //     })
    //     .then((json) => {
    //         console.log(json); 
    //     });
      
   
    // };
    return (
      
      <div className="ag-theme-alpine" style={{ float:"left" ,height: 800, width: 600 }}>
        <AgGridReact
          columnDefs={columnDefs}
          rowData={rowData}
          onSelectionChanged={onSelectionChanged2}
          rowSelection={'single'}
          onCellEditingStopped={handleCellEditingStopped}
          ref={gridRef2}
        />
        <span id="selectedRows"></span>
        
        <button onClick={handleSubmit}>Submit</button>
       
        <ReactModal style={customStyles} isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} >
  {
    
    <>  
    <h4>소득구분코드 도움</h4>
    <div className="ag-theme-alpine" style={{ float:"left" ,height: 400, width: 400 }}>
        <AgGridReact
          columnDefs={divColumn}
          rowData={divRowData}
          onGridReady={onGridReady}
          rowSelection={'single'}
          onCellDoubleClicked={DivModalDoubleClicked}
          onCellEditingStopped={handleCellEditingStopped}
          onSelectionChanged={onSelectionChanged}
          
          ref={gridRef}

        />
        </div>
       
    <>
    <br/>   <div style={{textAlign:"center"}}>
    <h5>선택 코드: {selectValue.div_code}</h5>
    <h5>구분명:{selectValue.div_name}</h5>
            <button onClick={{}}>확인</button>
            <button onClick={()=>setIsModalOpen(false)}>취소</button>
            </div>
          </></>
          }
</ReactModal>;
      </div>
    );
  };

export default EarnerGrid;
