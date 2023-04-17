import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import React, { useCallback, useMemo, useRef, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import ReactModal from "react-modal";
import { Link } from "react-router-dom";
import NumberRenderer from "../util/NumberRenderer";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    width: "360px",
    height: "520px",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000, // .sidebar-menu의 z-index 값보다 큰 값으로 설정
  },
};
const LinkStyle = {
  display: "inline-block",
  padding: "0.4rem",
  margin: "0 1rem",
  textDecoration: "none",
  fontWeight: "bold",
  color: "gray",
  borderBottom: "3px solid #6273D9",
  transition: "all 0.2s ease-in-out",
};

const ActiveLinkStyle = {
  borderBottom: "5px solid black",
  color: "black",
};

const NavLink = ({ to, children }) => (
  <Link to={to} style={LinkStyle} activeStyle={ActiveLinkStyle}>
    {children}
  </Link>
);
const EarnDivRead = (props) => {
  const earnerGridRef = useRef();
  props.setTitle("사업소득조회");
  registerLocale("ko", ko);
  const [rowData, setRowData] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const gridRef = useRef();
  function getCellStyle(params) {
    if (params.value === 0 || undefined) {
      return {
        backgroundColor: "lightgrey",
        color: "transparent",
        opacity: 0.4,
        textAlign: "right",
      };
    } else {
      return { textAlign: "right" };
    }
  }
  const [earner, setEarner] = useState("");
  const columnDefs = [
    {
      field: "div_code_rs",
      headerName: "소득구분",

      maxWidth: 150,
      cellStyle: { textAlign: "center" },
    },
    {
      field: "earner_name_rs",
      headerName: "소득자명(상호)",

      cellStyle: { textAlign: "center" },
    },
    {
      field: "personal_no",
      headerName: "주민(사업자)등록번호",

      minWidth: 160,
      maxWidth: 150,
      cellStyle: { textAlign: "center" },
    },
    {
      field: "is_native_rs",
      headerName: "내/외국인",

      maxWidth: 120,
    },
    {
      field: "count_rs",
      headerName: "건수",

      maxWidth: 100,
      cellStyle: { textAlign: "center" },
    },

    {
      field: "total_payment_rs",
      headerName: "연간총지급액",

      cellRenderer: "numberRenderer",
      cellStyle: getCellStyle,
    },
    {
      field: "tax_rate_rs",
      headerName: "세율(%)",

      maxWidth: 130,
      cellStyle: getCellStyle,
    },
    {
      field: "tax_income_rs",
      headerName: "소득세",

      maxWidth: 140,
      cellRenderer: "numberRenderer",
      cellStyle: getCellStyle,
    },
    {
      field: "tax_local_rs",
      headerName: "지방소득세",

      maxWidth: 140,
      cellRenderer: "numberRenderer",
      cellStyle: getCellStyle,
    },
    {
      field: "tax_total_rs",
      headerName: "세액계",

      maxWidth: 140,
      cellRenderer: "numberRenderer",
      cellStyle: getCellStyle,
    },
    {
      field: "artist_cost_rs",
      headerName: "예술인경비",

      maxWidth: 140,
      cellRenderer: "numberRenderer",
      cellStyle: getCellStyle,
    },
    {
      field: "ins_cost_rs",
      headerName: "고용보험료",

      maxWidth: 140,
      cellRenderer: "numberRenderer",
      cellStyle: getCellStyle,
    },
    {
      field: "real_payment_rs",
      headerName: "계",

      maxWidth: 140,
      cellRenderer: "numberRenderer",
      cellStyle: getCellStyle,
    },
  ];

  const defaultColDef = useMemo(() => {
    return {
      sortable: false,
      filter: false,
      lockPosition: true,
    };
  }, []);
  const DivModalDoubleClicked = useCallback(() => {
    const selectedRows = gridRef.current.api.getSelectedRows();
    setEarner(selectedRows[0].div_code);
    setIsModalOpen(false);
  }, []);
  const [divOptions, setDivOptions] = useState([
    "",
    "940100",
    "940301",
    "940302",
    "940304",
    "940306",
    "940903",
    "940910",
    "940912",
    "940913",
    "940918",
    "940919",
    "940926",
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const excelFileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const excelFileExtension = ".xlsx";
  const excelFileName = `${earner} 코드별 사업소득조회`;

  const excelDownload = (excelData) => {
    const ws = XLSX.utils.aoa_to_sheet([
      [`작업자_${localStorage.getItem("worker_id")}`],
      [],
      [
        "소득구분",
        "소득자명(상호)",
        "주민번호",
        "내/외국인",
        "건수",
        "연간총지급액",
        "세율",
        "소득세",
        "지방소득세",
        "세액계",
        "예술인경비",
        "고용보험료",
        "계",
      ],
    ]);
    excelData.map((data) => {
      XLSX.utils.sheet_add_aoa(
        ws,
        [
          [
            data.div_code_rs,
            data.earner_name_rs,
            data.personal_no,
            data.is_native_rs,
            data.count_rs,
            data.total_payment_rs,
            data.tax_rate_rs,
            data.tax_income_rs,
            data.tax_local_rs,
            data.tax_total_rs,
            data.artist_cost_rs,
            data.ins_cost_rs,
            data.real_payment_rs,
          ],
        ],
        { origin: -1 }
      );
      ws["!cols"] = [
        { wpx: 150 },
        { wpx: 150 },
        { wpx: 100 },
        { wpx: 100 },
        { wpx: 100 },
        { wpx: 50 },
        { wpx: 100 },
        { wpx: 150 },
        { wpx: 120 },
        { wpx: 150 },
        { wpx: 200 },
        { wpx: 200 },
        { wpx: 200 },
        { wpx: 200 },
      ];
      return false;
    });
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelButter = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const excelFile = new Blob([excelButter], { type: excelFileType });
    FileSaver.saveAs(excelFile, excelFileName + excelFileExtension);
  };
  const handlePrevClick = () => {
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
      setEarner(divOptions[selectedIndex - 1]);
    }
  };
  const handleDoublePrevClick = () => {
    setSelectedIndex(0);
    setEarner(divOptions[selectedIndex]);
  };
  const handleNextClick = () => {
    if (selectedIndex < divOptions.length - 1) {
      setSelectedIndex(selectedIndex + 1);
      setEarner(divOptions[selectedIndex + 1]);
    }
  };
  const handleDoubleNextClick = () => {
    setSelectedIndex(8);
    setEarner(divOptions[selectedIndex]);
  };
  const [divRowData, setDivRowData] = useState();
  const divColumn = [
    { headerName: "소득구분코드", field: "div_code", width: 180 },
    { headerName: "소득구분명", field: "div_name", width: 160 },
  ];
  const onGridReady = useCallback((params) => {
    fetch("http://localhost:8080/regist/list_divcode")
      .then((resp) => resp.json())
      .then((data) => setDivRowData(data.div_list));
  }, []);
  const [selectValue, setSelectValue] = useState("");

  const onSelectionChanged = useCallback(() => {
    const selectedRows = gridRef.current.api.getSelectedRows();
    setSelectValue(selectedRows[0]);
  }, []);
  const cellClickedListener = useCallback((event) => {
    console.log("cellClicked", event);
  }, []);
  const [selectedOption, setSelectedOption] = useState("accrual_ym");

  function handleChange(event) {
    setSelectedOption(event.target.value);
  }

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selected, setSelected] = useState("");
  const [selected2, setSelected2] = useState("earner_name");

  function handleEarner(event) {
    setEarner(event.target.value);
  }
  function handleDivChange(event) {
    const value = event.target.value;
    setEarner(value);
  }
  const gridOptions = {
    pinnedBottomRowData: [],
  };
  function handleSubmit(event) {
    event.preventDefault();
    if (!startDate) {
      Swal.fire("기간을 선택해주세요", "", "question");
    }
    fetch("http://localhost:8080/list/search_div_code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        worker_id: "yuchan2",
        read_by: selectedOption,
        start_date: parseInt(format(startDate, "yyyyMM")),
        end_date: parseInt(format(endDate, "yyyyMM")),
        code_value: earner,
        order_by: selected2,
      }),
    })
      .then((result) => result.json())
      .then((rowData) => {
        console.log(rowData);

        const sums = rowData.earnerInfo.reduce(
          (acc, curr) => ({
            countSum: acc.countSum + curr.count_rs,
            insCostSum: acc.insCostSum + curr.ins_cost_rs,
            artistSum: acc.artistSum + curr.artist_cost_rs,
            totalSum: acc.totalSum + curr.total_payment_rs,
            taxTotalSum: acc.taxTotalSum + curr.tax_total_rs,
            taxLocalSum: acc.taxLocalSum + curr.tax_local_rs,
            taxIncomeSum: acc.taxIncomeSum + curr.tax_income_rs,
            realPaymentSum: acc.realPaymentSum + curr.real_payment_rs,
          }),
          {
            realPaymentSum: 0,
            insCostSum: 0,
            artistSum: 0,
            totalSum: 0,
            taxLocalSum: 0,
            taxIncomeSum: 0,
            countSum: 0,
            taxTotalSum: 0,
          }
        );
        const {
          realPaymentSum,
          insCostSum,
          artistSum,
          totalSum,
          taxLocalSum,
          taxIncomeSum,
          countSum,
          taxTotalSum,
        } = sums;
        earnerGridRef.current.api.setPinnedBottomRowData([
          {
            personal_no: "합계",
            ins_cost_rs: insCostSum,
            total_payment_rs: totalSum,
            tax_local_rs: taxLocalSum,
            artist_cost_rs: artistSum,
            real_payment_rs: realPaymentSum,
            tax_income_rs: taxIncomeSum,
            count_rs: countSum,
            tax_total_rs: taxTotalSum,
          },
        ]);

        setRowData(rowData.earnerInfo);
      });
  }
  let api;
  const onEarnerGridReady = (params) => {
    api = params.api;
    earnerGridRef.current.api.sizeColumnsToFit();
  };
  const frameworkComponents = {
    numberRenderer: NumberRenderer,
  };

  return (
    <div>
      <div>
        <NavLink to="/earnerRead">소득자별</NavLink>
        <NavLink to="/earnDivRead">소득구분별</NavLink>
      </div>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexWrap: "wrap", border: "1px solid grey" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginRight: "1rem",
            marginLeft: "2rem",
          }}
        >
          기준
          <select value={selectedOption} onChange={handleChange}>
            <option value="accrual_ym">1.귀속년월</option>
            <option value="payment_ym">2.지급년월</option>
          </select>
        </div>
        <div
          style={{ display: "flex", alignItems: "center", marginRight: "1rem" }}
        >
          <div>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              minDate={new Date(2022, 0, 1)}
              maxDate={new Date(2022, 11, 31)}
              dateFormat="yyyy.MM"
              locale={"ko"}
              placeholderText="2022."
              showMonthYearPicker
            />
          </div>
          ~
          <div>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              minDate={new Date(2022, 0, 1)}
              maxDate={new Date(2022, 11, 31)}
              locale={"ko"}
              placeholderText="2022."
              dateFormat="yyyy.MM"
              showMonthYearPicker
            />
          </div>
        </div>
        <div
          style={{ display: "flex", alignItems: "center", marginRight: "1rem" }}
        >
          소득구분
          <input
            onChange={handleEarner}
            value={earner}
            type="text"
            placeholder="전체"
            onClick={() => setIsModalOpen(true)}
            readOnly
            style={{ width: "100px" }}
          ></input>
        </div>
        <div
          style={{ display: "flex", alignItems: "center", marginRight: "1rem" }}
        >
          현재소득구분
          <button
            style={{ width: "35px", marginRight: "0.1rem" }}
            onClick={handleDoublePrevClick}
          >
            &lt;&lt;
          </button>
          <button
            style={{ width: "35px", marginRight: "0.1rem" }}
            onClick={handlePrevClick}
          >
            &lt;
          </button>
          <select value={earner} onChange={handleDivChange}>
            {divOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
          <button
            style={{ width: "35px", marginRight: "0.1rem" }}
            onClick={handleNextClick}
          >
            &gt;
          </button>
          <button
            style={{ width: "35px", marginRight: "0.1rem" }}
            onClick={handleDoubleNextClick}
          >
            &gt;&gt;
          </button>
        </div>

        <button
          type="submit"
          style={{
            display: "flex",
            alignItems: "center",
            width: "45px",
            marginLeft: "28rem",
          }}
        >
          조회
        </button>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            width: "45px",
            marginRight: "30px",
          }}
          onClick={() => excelDownload(rowData)}
        >
          엑셀
        </button>
      </form>
      <div
        className="ag-theme-alpine"
        style={{
          width: "99%",
          height: "75vh",
          padding: "5px",
          marginLeft: "10px",
          fontSize: "10px",
          textAlign: "right",
        }}
      >
        <AgGridReact
          ref={earnerGridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          animateRows={true}
          rowSelection="multiple"
          overlayLoadingTemplate={
            '<span style="padding: 10px;"><TbFileX>데이터가 없습니다</span>'
          }
          overlayNoRowsTemplate={
            '<span style="padding: 10px;">데이터가 없습니다</span>'
          }
          onCellClicked={cellClickedListener}
          defaultColDef={defaultColDef}
          gridOptions={gridOptions}
          onGridReady={onEarnerGridReady}
          frameworkComponents={frameworkComponents}
        />
      </div>
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
              style={{ height: 400, width: 360, textAlign: "center" }}
            >
              <AgGridReact
                columnDefs={divColumn}
                rowData={divRowData}
                onGridReady={onGridReady}
                rowSelection={"single"}
                onRowDoubleClicked={DivModalDoubleClicked}
                onSelectionChanged={onSelectionChanged}
                ref={gridRef}
              />
            </div>

            <>
              <div style={{ textAlign: "center", marginTop: 10 }}>
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
export default EarnDivRead;
