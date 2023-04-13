import React, {
  useCallback,
  useRef,
  useState,
  useEffect,
  useReducer,
} from "react";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import ReactModal from "react-modal";
import Swal from "sweetalert2";

const EarnerGrid = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const gridRef = useRef(null);
  const gridRef2 = useRef(null);

  const columnDefs = [
    {
      headerName: "V",
      headerCheckboxSelection: true,
      checkboxSelection: true,
      maxWidth: 40,
    },
    {
      headerName: "Code",
      field: "earner_code",
      editable: (params) => {
        return !params.node.data.div_code && params.node.data.earner_name;
      },
      maxWidth: 90,
      resizable: true,
      cellEditor: "agTextCellEditor",
      cellEditorParams: {
        // 입력 제한 설정
        maxLength: 6,
        pattern: "\\d*", // 숫자만 입력할 수 있도록 정규식 설정
      },
    },
    {
      headerName: "소득자명",
      field: "earner_name",
      editable: true,
      maxWidth: 100,
      resizable: true,
    },

    {
      headerName: "주민(외국인)번호",
      children: [
        {
          headerName: "구분",
          field: "is_native",
          editable: true,
          maxWidth: 70,
          cellEditor: "agSelectCellEditor",
          resizable: true,
          cellEditorParams: {
            values: ["내", "외"],
          },
        },
        {
          headerName: "번호",
          field: "personal_no",
          minWidth: 130,
          maxWidth: 130,
          editable: true,
          colspan: 2,
          cellEditor: "agTextCellEditor",
          resizable: true,
          cellEditorParams: {
            // 입력 제한 설정
            maxLength: 14,
            pattern: "\\d*",
          },
        },
      ],
    },
    {
      headerName: "소득구분",
      children: [
        {
          headerName: "구분코드",
          field: "div_code",
          editable: false,
          resizable: true,
          maxWidth: 90,
        },
        {
          headerName: "구분명",
          field: "div_name",
          width: 90,
          editable: false,
          resizable: false,
          colspan: 2,
        },
        { headerName: "타입", field: "div_type", width: 100, hide: true },
      ],
    },
  ];
  const divColumn = [
    { headerName: "소득구분코드", field: "div_code", width: 180 },
    { headerName: "소득구분명", field: "div_name", width: 160 },
  ];
  const selectedCode = useRef();
  const [selectedCell, setSelectedCell] = useState(null);
  const earnerCellClicked = (event) => {
    const { data, colDef } = event;
    const { field } = colDef;
    if (field === "div_code") {
      if (!event.data.div_name) {
        setSelectedCell(event.node);
        setIsModalOpen(true);
      }
      if (!event.data.earner_name) {
        setIsModalOpen(false);
        Swal.fire("", "이름을 먼저 입력해주세요", "info");
      }
    }
    if (field === "personal_no") {
      if (!event.data.earner_name) {
        setIsModalOpen(false);
        Swal.fire("", "이름을 먼저 입력해주세요", "info");
      }
    }
    const selectedCell = event.data;
    if (selectedCell.earner_code && selectedCell.div_code) {
      selectedCode.current = selectedCell.earner_code;
      console.log(selectedCell.earner_code);
      setValue(selectedCell.earner_code);
      props.onValueChange(selectedCell.earner_code);
    }
  };

  let earnerGridApi;
  const onEarnerGridReady = (params) => {
    gridRef2.current.api.sizeColumnsToFit();
    earnerGridApi = params.api;
    const gridColumnApi = params.columnApi;
  };

  const onCellValueChanged = (event) => {
    const { data, colDef } = event;
    const { field } = colDef;
    //이름 작성시
    if (field === "earner_name") {
      if (event.data.earner_code) {
        fetch("http://localhost:8080/regist/earner_update", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            worker_id: localStorage.getItem("worker_id"),
            earner_code: event.data.earner_code,
            param_name: "earner_name",
            param_value: event.data.earner_name,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            // if(data.status===true){
            //   Swal.fire('변경성공','','success');
            // }
          });
      } else {
        defaultCode.current = 1;
        fetch("http://localhost:8080/regist/get_count", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code_count: localStorage.getItem("code_count"),
            worker_id: localStorage.getItem("worker_id"),
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            const codeCount = data.code_count.toString().padStart(6, "0");
            event.node.setDataValue("earner_code", codeCount);
            event.node.setDataValue("is_native", "내");
            const newRowData = {};
            gridRef2.current.api.applyTransaction({ add: [newRowData] });
          });
      }
    }
    if (
      (field === "personal_no" || field === "is_native") &&
      event.data.div_code
    ) {
      fetch("http://localhost:8080/regist/earner_update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          worker_id: localStorage.getItem("worker_id"),
          earner_code: event.data.earner_code,
          param_value: data[field],
          param_name: field,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === true) {
            Swal.fire("변경성공", "", "success");
          }
        });
    }
    if (
      field === "div_code" &&
      event.data.earner_code &&
      event.data.earner_name
    ) {
      fetch("http://localhost:8080/regist/earner_insert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          worker_id: localStorage.getItem("worker_id"),
          earner_code: event.data.earner_code,
          earner_name: event.data.earner_name,
          div_code: event.data.div_code,
          div_name: event.data.div_name,
          div_type: event.data.div_type,
          is_default: defaultCode.current,
          is_native: event.data.is_native,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data.code_count);
          if (data.code_count !== 0) {
            localStorage.setItem("code_count", data.code_count);
            fetch("http://localhost:8080/regist/earner_update", {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                worker_id: localStorage.getItem("worker_id"),
                earner_code: event.data.earner_code,
                param_value: event.data.personal_no,
                param_name: "personal_no",
              }),
            });
          }
        });
    }
  };
  function reducer(state, action) {
    return {
      ...state,
      [action.name]: action.value,
    };
  }
  const [state, dispatch] = useReducer(reducer, {
    search_value: "",
  });
  const { search_value } = state;
  const onChange = (e) => {
    dispatch(e.target);
    const { value } = e.target;

    fetch(`http://localhost:8080/regist/list_divcode/${value}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setDivRowData(data.div_list);
      });
  };
  const onCellEditingStopped = (event) => {
    const { data, colDef } = event;
    const { field } = colDef;

    if (field === "earner_code") {
      console.log("코드입력");
      const inputCode = event.data.earner_code;
      const codeRegex = /^\d{6}$/;
      if (!codeRegex.text(inputCode)) {
        Swal.fire({
          title: "코드 형식이 맞지 않습니다",
          text: "6자리의 숫자를 입력해주세요",
          icon: "error",
        });
      } else {
        fetch("http://localhost:8080/regist/check_code", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            custom_code: inputCode,
            worker_id: localStorage.getItem("worker_id"),
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
              defaultCode.current = 0;
            }
          });
      }
    }

    if (field === "personal_no") {
      const koreanRegex = /^\d{6}-\d{7}$/;
      const foreignRegex = /^\d{6}[a-zA-Z\d]{7}$/;

      if (event.data.is_native === "내") {
        if (!koreanRegex.test(event.data.personal_no)) {
          Swal.fire({
            title: "다시입력해주세요",
            text: "올바르지 않은 형식입니다",
            icon: "error",
          });
          event.node.setDataValue("personal_no", "");
        }
      } else if (event.data.is_native === "외") {
        if (!foreignRegex.test(event.data.personal_no)) {
          Swal.fire({
            title: "다시입력해주세요",
            text: "올바르지 않은 형식입니다",
            icon: "error",
          });
          event.node.setDataValue("personal_no", "");
        }
      }
    }
  };
  useEffect(() => {
    fetch(
      `http://localhost:8080/regist/earner_list/${localStorage.getItem(
        "worker_id"
      )}`
    )
      .then((resp) => resp.json())
      .then((rowData) => {
        rowData.earner_list.push({});
        setRowData(rowData.earner_list);
      });
  }, []);
  const defaultCode = useRef(1);
  const [rowData, setRowData] = useState([]);
  const [divRowData, setDivRowData] = useState();

  const onGridReady = useCallback((params) => {
    fetch("http://localhost:8080/regist/list_divcode")
      .then((resp) => resp.json())
      .then((data) => setDivRowData(data.div_list));
  }, []);

  const gridOptions = {
    suppressScrollOnNewData: true,
    //onCellClicked: onCellClicked,
    onCellValueChanged: onCellValueChanged,
  };

  const DivModalDoubleClicked = () => {
    setIsModalOpen(false);
    selectedCell.setDataValue("div_code", selectValue.div_code);
    selectedCell.setDataValue("div_name", selectValue.div_name);
    selectedCell.setDataValue("div_type", selectValue.div_type);
  };
  const [selectValue, setSelectValue] = useState("");
  const [codeList, setCodeList] = useState([]);
  const onSelectionChanged = useCallback(() => {
    const selectedRows = gridRef.current.api.getSelectedRows();
    setSelectValue(selectedRows[0]);
    console.log(selectedRows[0]);
  }, []);
  const [value, setValue] = useState(props.value);

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
  const deleteCodes = useRef([]);
  function onRowSelected(event) {
    let earner_code = event.node.data.earner_code;
    let isSelected = event.node.isSelected();

    if (isSelected === true) {
      deleteCodes.current = [...deleteCodes.current, earner_code];
      console.log("선택", deleteCodes.current);
    } else if (isSelected === false) {
      deleteCodes.current = deleteCodes.current.filter(
        (code) => code !== earner_code
      );
      console.log("선택해제", deleteCodes.current);
    }
    props.setEarnerCodes(deleteCodes.current);
  }
  return (
    <div
      className="ag-theme-alpine"
      style={{
        float: "left",
        height: "640px",
        width: "41%",
        marginTop: "10px",
        padding: "5px",
      }}
    >
      <AgGridReact
        columnDefs={columnDefs}
        rowData={rowData}
        rowSelection={"multiple"}
        singleClickEdit={"false"}
        suppressRowClickSelection={"true"}
        onRowSelected={onRowSelected}
        onCellEditingStopped={onCellEditingStopped}
        onCellClicked={earnerCellClicked}
        ref={gridRef2}
        gridAutoHeight={true}
        onGridReady={onEarnerGridReady}
        gridOptions={gridOptions}
        isRowSelectable={(params) => {
          return !!params.data.earner_code;
        }}
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
                overlayLoadingTemplate={
                  '<span style="padding: 10px">데이터가 없습니다</span>'
                }
                overlayNoRowsTemplate={
                  '<span style="padding: 10px">데이터가 없습니다</span>'
                }
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
                찾을 내용{" "}
                <input
                  type="text"
                  name="search_value"
                  style={{
                    width: "300px",
                    borderColor: "skyblue",
                    outline: "none",
                  }}
                  value={search_value}
                  onChange={onChange}
                />
                <br />
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
