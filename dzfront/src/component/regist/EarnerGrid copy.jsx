import React, {
  useCallback,
  useRef,
  useState,
} from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import ReactModal from "react-modal";
import Swal from "sweetalert2";

const EarnerGrid = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const gridRef = useRef();
  const gridRef2 = useRef();
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  const columnDefs = [
    { headerName: "V", checkboxSelection: true, width: 50 },
    {
      headerName: "Code",
      field: "earner_code",
      editable: true,
      width: 90,
      onCellValueChanged: () => checkCode(),
    },
    {
      headerName: "소득자명",
      field: "earner_name",
      editable: true,
      width: 90,
      onCellValueChanged: () => getCode(),
    },

    {
      headerName: "주민(외국인)번호",
      children: [
        {
          headerName: "구분",
          field: "is_native",
          editable: true,
          width: 70,
          cellEditor: "agSelectCellEditor",
          cellEditorParams: {
            values: ["내", "외"],
          },
        },
        {
          headerName: "번호",
          field: "personal_no",
          width: 150,
          editable: true,
          colspan: 2,
        },
      ],
    },
    {
      headerName: "소득구분",
      children: [
        {
          headerName: "구분코드",
          field: "div_code",
          editable: true,
          width: 90,
          onCellClicked: () => setIsModalOpen(true),
        },
        {
          headerName: "구분명",
          field: "div_name",
          width: 100,
          editable: true,
          colspan: 2,
        },
      ],
    },
  ];
  const divColumn = [
    { headerName: "소득구분코드", field: "div_code", width: 180 },
    { headerName: "소득구분명", field: "div_name", width: 160 },
  ];

  const [defaultCode, setDefaultCode] = useState(false);
  const [rowData, setRowData] = useState();
  const [divRowData, setDivRowData] = useState();
  const checkCode = () => {
    const selectedRows = gridRef2.current.api.getSelectedRows();
    const inputCode = selectedRows[0].earner_code;

    fetch("http://localhost:8080/regist/check_code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        custom_code: inputCode,
        worker_id: "yuchan2",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.code_count);
        if (data.code_count >= 1) {
          Swal.fire({
            title: "이미 존재하는 코드입니다",
            text: "다른코드를 입력하세요",
            icon: "error",
          });
        } else {
          Swal.fire({
            title: "사용가능한 코드입니다",
            text: "..",
            icon: "success",
          });
          setDefaultCode(false);
        }
      });
  };
  const getCode = () => {
    const selectedRows = gridRef2.current.api.getSelectedRows();
    console.log(selectedRows[0]);
    setDefaultCode(true);
    fetch("http://localhost:8080/regist/get_count", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code_count: 5,
        worker_id: "yuchan2",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const codeCount = data.code_count.toString().padStart(6, "0");
        fetch(`http://localhost:8080/regist/earner_list/yuchan2`)
          .then((result) => result.json())
          .then((rowData) => {
            rowData.earner_list.push({
              ...selectedRows[0],
              earner_code: codeCount,
              earner_name: selectedRows[0].earner_name,
              is_native: "내",
              is_default: defaultCode,
            });
            rowData.earner_list.push({});
            setRowData(rowData.earner_list);
          });
      });
    //setRowData(rowData.earner_list);
    //setRowData([{...rowData.earner_list, earner_code: code, is_native:'내',earner_name:'',personal_no:'',div_code:'',div_name:''}]);
    // gridRef2.current.api.applyTransaction({ add: [{ earner_code: code, is_native:'내'}] });
  };

  const onGridReady = useCallback((params) => {
    fetch("http://localhost:8080/regist/list_divcode")
      .then((resp) => resp.json())
      .then((data) => setDivRowData(data.div_list));
  }, []);

  const onEarnerGridReady = useCallback((params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    fetch(`http://localhost:8080/regist/earner_list/yuchan2`)
      .then((resp) => resp.json())
      .then((rowData) => {
        rowData.earner_list.push({});
        setRowData(rowData.earner_list);
      });
  }, []);
 


  const gridOptions = {
    suppressScrollOnNewData: true,
  };

  const DivModalDoubleClicked = useCallback(() => {
    const selectedRows = gridRef.current.api.getSelectedRows();
    const earnerRows = gridRef2.current.api.getSelectedRows();
    setIsModalOpen(false);

    fetch(`http://localhost:8080/regist/earner_list/yuchan2`)
      .then((result) => result.json())
      .then((rowData) => {
        rowData.earner_list.push({
          ...earnerRows[0],
          div_code: selectedRows[0].div_code,
          div_name: selectedRows[0].div_name,
        });
        //setRowData({ ...earnerRows[0],div_code:selectedRows[0].div_code,div_name:selectedRows[0].div_name});
        rowData.earner_list.push({});
        setRowData(rowData.earner_list);
      });

    fetch("http://localhost:8080/regist/earner_insert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...earnerRows[0],
        worker_id: "yuchan2",
      }),
    }).then((response) => {
      response.json();
      rowData.earner_list.push({});
      setRowData(rowData.earner_list);
    });
  }, []);
  const [selectValue, setSelectValue] = useState("");

  const onSelectionChanged = useCallback(() => {
    const selectedRows = gridRef.current.api.getSelectedRows();
    setSelectValue(selectedRows[0]);
  }, []);
  const [value, setValue] = useState(props.value);
 
  const onSelectionChanged2 = useCallback(() => {
    const selectedRows2 = gridRef2.current.api.getSelectedRows();
    const newValue = selectedRows2[0].earner_code;
    setValue(newValue);
    props.onValueChange(newValue);
  }, []);
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };
  const handleDataChange = (event) => {
    const selectedRows2 = gridRef2.current.api.getSelectedRows();
    const lastRowIndex = rowData.length - 1;
    const lastRow = selectedRows2[0];
    const lastRowData = Object.values(lastRow);

    // Check if last row is fully filled with data
    if (lastRowData.every((cellData) => cellData !== "")) {
      // Send last row's data to server
      fetch("http://localhost:8080/regist/earner_insert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...selectedRows2[0],
          worker_id: "yuchan2",
        }),
      })
        .then((response) => {
          response.json();
          rowData.earner_list.push({});
          setRowData(rowData.earner_list);
        })
        .then((rowData) => {});
    }
  };

  return (
    <div
      className="ag-theme-alpine"
      style={{ float: "left", height: 800, width: 600, marginTop: "40px" }}
    >
      <AgGridReact
        columnDefs={columnDefs}
        rowData={rowData}
        onGridReady={onEarnerGridReady}
        onSelectionChanged={onSelectionChanged2}
        rowSelection={"multiple"}
        singleClickEdit={"false"}
        suppressRowClickSelection = {false}
        onCellValueChanged={handleDataChange}
        onCellEditingStopped={handleDataChange}
        onCellClicked={handleDataChange}
        ref={gridRef2}
        gridOptions={gridOptions}
      />

    

      <ReactModal
        style={customStyles}
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
      >
        {
          <>
            <h4>소득구분코드 도움</h4>
            <div
              className="ag-theme-alpine"
              style={{ float: "left", height: 400, width: 400 }}
            >
              <AgGridReact
                columnDefs={divColumn}
                rowData={divRowData}
                onGridReady={onGridReady}
                rowSelection={"single"}
                onCellDoubleClicked={DivModalDoubleClicked}
                onSelectionChanged={onSelectionChanged}
                ref={gridRef}
              />
            </div>

            <>
              <br />{" "}
              <div style={{ textAlign: "center" }}>
                <h5>선택 코드: {selectValue.div_code}</h5>
                <h5>구분명:{selectValue.div_name}</h5>
                <button onClick={DivModalDoubleClicked}>확인</button>
                <button onClick={() => setIsModalOpen(false)}>취소</button>
              </div>
            </>
          </>
        }
      </ReactModal>
    </div>
  );
};

export default EarnerGrid;
