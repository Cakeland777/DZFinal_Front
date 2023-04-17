import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import React, {
  useMemo,
  useRef,
  useState,
  useCallback,
  useReducer,
  useEffect,
  memo,
} from "react";
import ErrorAlert from "../util/ErrorAlert";
import Swal from "sweetalert2";
import Calendar from "../Calendar";
import "../../css/IncomeInput2.css";
import ReactModal from "react-modal";
import { AgGridReact } from "ag-grid-react";
import DatePicker, { registerLocale } from "react-datepicker";
import { ko } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import NumberRenderer from "../util/NumberRenderer";

const IncomeInput2 = (props) => {
  //datepicker관련
  props.setTitle("사업소득자료입력");
  const frameworkComponents = {
    numberRenderer: NumberRenderer,
  };
  const bottom = useRef({});
  //const [bottom, setBottom] = useState({});
  registerLocale("ko", ko);
  const [error, setError] = useState([]);
  const [workDate, setWorkDate] = useState([]);
  const [bottomData, setBottomData] = useState([]);
  const earnerGridRef = useRef();
  const [earnerData, setEarnerData] = useState([]);
  const [selectedType, setSelectedType] = useState();
  const EarnerColumn = [
    { headerName: "Code", field: "earner_code", width: 150 },
    { headerName: "소득자명", field: "earner_name", width: 160 },
    { headerName: "내/외", field: "is_native", width: 80 },
    { headerName: "주민등록번호", field: "personal_no", width: 160 },
    { headerName: "소득구분명", field: "div_name", width: 120 },
    { headerName: "구분코드", field: "div_code", width: 130 },
  ];

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      width: "820px",
      height: "550px",
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
  const useLeftColumnDefs = useCallback(
    () => [
      {
        checkboxSelection: true,
        width: 50,
        headerCheckboxSelection: true,
        cellClass: "cellCenter",
      },
      //{ headerName: "Code", field: "earner_code",editable:true,width:90},
      {
        headerName: "소득자명",
        field: "earner_name",
        editable: false,
        width: 80,
        onCellClicked: (event) => {
          if (!event.data.earner_name) {
            setIsModalOpen(true);
          }
        },
      },

      {
        headerName: "주민(외국인)번호",
        children: [
          {
            headerName: "구분",
            field: "is_native",
            editable: false,
            width: 60,
            resizable: false,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
              values: ["내", "외"],
            },
          },
          {
            headerName: "번호",
            field: "personal_no",
            width: 120,
            editable: false,
            colspan: 2,
          },
        ],
      },

      {
        headerName: "소득구분",
        resizable: false,
        children: [
          {
            headerName: "구분코드",
            field: "div_code",
            editable: false,
            width: 80,
          },
          {
            headerName: "구분명",
            field: "div_name",
            width: 75,
            editable: false,
            colspan: 2,
          },
        ],
      },
    ],
    []
  );
  const LeftColumnDefs = useLeftColumnDefs();

  const [selectedDate, setSelectedDate] = useState("");
  const startDate = useRef("");
  const selectedCode = useRef("");
  const taxId = useRef("");

  const [sumTask, setSumTask] = useState({});
  const [earnerCount, setEarnerCount] = useState("");

  const setDate = () => {
    console.log(startDate.current);
    setSelectedDate(startDate.current);
    props.setPaymentYm(parseInt(format(startDate.current, "yyyyMM")));
    topGrid.current.api.setPinnedBottomRowData([]);
    fetch("http://localhost:8080/input/earner_search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        worker_id: localStorage.getItem("worker_id"),
        payment_ym: parseInt(format(startDate.current, "yyyyMM")),
        search_value: "",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setEarnerRowData(data.earner_list);
      });
    fetch("http://localhost:8080/input/get_task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        worker_id: localStorage.getItem("worker_id"),
        payment_ym: parseInt(format(startDate.current, "yyyyMM")),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.task_list != null) {
          data.task_list.push({});
          setEarnerCount(data.task_count);
          setEarnerData(data.task_list);
          setRowData([]);
        } else {
          setBottomData([]);
        }
        fetch("http://localhost:8080/input/sum_task", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            worker_id: localStorage.getItem("worker_id"),
            payment_ym: parseInt(format(startDate.current, "yyyyMM")),
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.sum_task != null) {
              console.log(data.sum_task);
              setSumTask(data.sum_task);
            } else {
              setSumTask({});
            }
          });
      });
  };
  const gridRef = useRef();

  const EarnerModalDoubleClicked = useCallback(() => {
    const selectedRows = gridRef.current.api.getSelectedRows();
    console.log(selectedRows[0]);
    console.log(parseInt(format(startDate.current, "yyyyMM")));
    fetch("http://localhost:8080/input/task_insert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        worker_id: localStorage.getItem("worker_id"),
        earner_code: selectedRows[0].earner_code,
        payment_ym: parseInt(format(startDate.current, "yyyyMM")),
      }),
    }).then((response) => {
      response.json();
      setDate();
    });

    setIsModalOpen(false);
    //const{search_value}='';
  }, []);

  let api;
  const onEarnerGridReady = (params) => {
    api = params.api;
    earnerGridRef.current.api.sizeColumnsToFit();
  };

  const taxRow = useRef();
  const onRightCellClicked = (event) => {
    const { data, colDef } = event;
    const { field } = colDef;
    const select = topGrid.current.api.getSelectedRows();
    taxRow.current = event.data;
    console.log("클릭~!", select);
    if (event.colDef.field === "accrual_ym") {
      console.log(selectedDate);

      event.node.setDataValue(
        "accrual_ym",
        parseInt(format(startDate.current, "yyyyMM"))
      );
      event.node.setDataValue(
        "payment_ym",
        parseInt(format(startDate.current, "yyyyMM"))
      );
    }
  };
  let rightGridApi;
  function onRightGridReady(params) {
    rightGridApi = params.api;
    //topGrid.current.api.sizeColumnsToFit();
    const gridColumnApi = params.columnApi;
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowData, setRowData] = useState();
  const [EarnerRowData, setEarnerRowData] = useState();
  const topGrid = useRef(null);

  const defaultColDef = useMemo(() => {
    return {
      editable: true,
      sortable: false,
      filter: false,
      lockPosition: true,
    };
  }, []);
  const totalValueGetter = (params) => {
    let total = 0;
    if (params.data.artist_cost + params.data.sworker_cost > 0) {
      total = params.data.artist_cost + params.data.sworker_cost;
    } else {
      total = null;
    }
    return total;
  };
  const totalInsValueGetter = (params) => {
    let insTotal = 0;
    if (params.data.ins_cost + params.data.sworker_ins > 0) {
      insTotal = params.data.ins_cost + params.data.sworker_ins;
    } else {
      insTotal = null;
    }
    return insTotal;
  };
  const onCellEditingStopped = (event) => {
    const { data, colDef } = event;
    const { field } = colDef;

    if (field === "accrual_ym") {
      fetch("http://localhost:8080/input/update_taxdate", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tax_id: event.data.tax_id,
          payment_date: event.data.payment_date,
          accrual_ym: event.data.accrual_ym,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((error) => {
              throw new Error(error.message);
            });
          }
          return response.json();
        })

        .catch((error) => {
          setError((prevErrors) => [...prevErrors, error.message]);
          event.node.setDataValue("accrual_ym", oldAcc.current);
        });
    }
    if (field === "total_payment") {
      fetch("http://localhost:8080/input/update_taxinfo", {
        method: "PATCH",
        body: JSON.stringify({
          tax_id: data.tax_id,
          total_payment: parseInt(data.total_payment),
          tax_rate: 3,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((error) => {
              throw new Error(error.message);
            });
          }
          return response.json();
        })
        .then((data) => {
          console.log("들어오는 값", bottom.current);
          event.node.setDataValue("tax_rate", data.earner_tax.tax_rate);
          event.node.setDataValue("tax_income", data.earner_tax.tax_income);
          event.node.setDataValue(
            "total_payment",
            data.earner_tax.total_payment
          );
          event.node.setDataValue("tax_local", data.earner_tax.tax_local);
          event.node.setDataValue("tax_total", data.earner_tax.tax_total);
          event.node.setDataValue("artist_cost", data.earner_tax.artist_cost);
          event.node.setDataValue("ins_cost", data.earner_tax.ins_cost);
          event.node.setDataValue("sworker_cost", data.earner_tax.sworker_cost);
          event.node.setDataValue("sworker_ins", data.earner_tax.sworker_ins);
          event.node.setDataValue(
            "workinjury_ins",
            data.earner_tax.workinjury_ins
          );
          event.node.setDataValue("real_payment", data.earner_tax.real_payment);
          event.node.setDataValue(
            "tuition_amount",
            data.earner_tax.tuition_amount
          );
          event.node.setDataValue("tax_id", data.earner_tax.tax_id);

          const newBottom = {
            ...bottom.current,
            payment_ym: "합계",
            total_payment:
              bottom.current.total_payment + data.earner_tax.total_payment,
            tax_local: bottom.current.tax_local + data.earner_tax.tax_local,
            ins_total:
              bottom.current.sworker_ins +
              data.earner_tax.sworker_ins +
              bottom.current.ins_cost +
              data.earner_tax.ins_cost,
            sworker_ins:
              bottom.current.sworker_ins + data.earner_tax.sworker_ins,
            ins_cost: bottom.current.ins_cost + data.earner_tax.ins_cost,
            artist_cost:
              bottom.current.artist_cost + data.earner_tax.artist_cost,
            sworker_cost:
              bottom.current.sworker_cost + data.earner_tax.sworker_cost,
            tax_total: bottom.current.tax_total + data.earner_tax.tax_total,
            workinjury_ins:
              bottom.current.workinjury_ins + data.earner_tax.workinjury_ins,
            total:
              bottom.current.artist_cost +
              data.earner_tax.artist_cost +
              bottom.current.sworker_cost +
              data.earner_tax.sworker_cost,
            real_payment:
              bottom.current.real_payment + data.earner_tax.real_payment,
            tax_income: bottom.current.tax_income + data.earner_tax.tax_income,
            tuition_amount:
              bottom.current.tuition_amount + data.earner_tax.tuition_amount,
          };

          topGrid.current.api.setPinnedBottomRowData([newBottom]);
          fetch("http://localhost:8080/input/sum_task", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              worker_id: localStorage.getItem("worker_id"),
              payment_ym: parseInt(format(startDate.current, "yyyyMM")),
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.sum_task != null) {
                console.log(data.sum_task);
                setSumTask(data.sum_task);
              } else {
                setSumTask({});
              }
            });
        })
        .catch((error) => {
          console.log(error.message);
          setError((prevErrors) => [...prevErrors, error.message]);
          event.node.setDataValue("total_payment", oldValue.current);
        });
    }
  };

  const oldValue = useRef();
  const oldDate = useRef();
  const oldAcc = useRef();
  const onCellEditingStarted = (event) => {
    const { data, colDef } = event;
    const { field } = colDef;
    if (field === "total_payment") {
      oldValue.current = event.data.total_payment;
      console.log(oldValue.current);
    }
    if (field === "payment_date") {
      oldDate.current = event.data.payment_date;
    }
    if (field === "accrual_ym") {
      oldAcc.current = event.data.accrual_ym;
    }
  };

  const rightGridOptions = {
    rowData: rowData,
    onCellClicked: onRightCellClicked,
    onCellValueChanged: onRightCellValueChanged,
    onCellEditingStopped: onCellEditingStopped,
    onCellEditingStarted: onCellEditingStarted,
    pinnedBottomRowData: [],
  };
  const columnDefs = [
    {
      headerName: "ID",
      field: "tax_id",
      width: 50,
      hide: true,
      suppressSizeToFit: true,
    },
    {
      headerName: "귀속년월",
      field: "accrual_ym",
      width: 90,
      suppressSizeToFit: true,
      cellStyle: { textAlign: "right" },
    },
    {
      headerName: "지급년월",
      field: "payment_ym",
      width: 90,
      editable: false,
      cellStyle: { textAlign: "right" },
      suppressSizeToFit: true,
    },
    {
      headerName: "일",
      field: "payment_date",
      width: 50,
      cellStyle: { textAlign: "right" },
      suppressSizeToFit: true,
    },
    {
      headerName: "지급총액",
      field: "total_payment",
      cellRenderer: "numberRenderer",
      width: 100,
      cellStyle: { textAlign: "right" },
      suppressSizeToFit: true,
    },
    {
      headerName: "세율",
      field: "tax_rate",
      width: 60,
      cellStyle: { textAlign: "right" },
      suppressSizeToFit: true,
    },
    {
      headerName: "학자금상환액",
      field: "tuition_amount",
      cellRenderer: "numberRenderer",
      editable: false,
      width: 100,
      cellStyle: getCellStyle,
      suppressSizeToFit: true,
    },
    {
      headerName: "소득세",
      field: "tax_income",
      cellRenderer: "numberRenderer",
      editable: false,
      width: 80,
      cellStyle: { textAlign: "right" },
      suppressSizeToFit: true,
    },
    {
      headerName: "지방소득세",
      field: "tax_local",
      cellRenderer: "numberRenderer",
      editable: false,
      width: 100,
      cellStyle: { textAlign: "right" },
      suppressSizeToFit: true,
    },
    {
      headerName: "세액계",
      field: "tax_total",
      cellRenderer: "numberRenderer",
      editable: false,
      width: 80,
      cellStyle: { textAlign: "right" },
      suppressSizeToFit: true,
    },
    {
      field: "artist_cost",
      hide: true,
      cellRenderer: "numberRenderer",
      cellStyle: getCellStyle,
      suppressSizeToFit: true,
    },
    {
      field: "sworker_cost",
      hide: true,
      cellRenderer: "numberRenderer",
      cellStyle: getCellStyle,
      suppressSizeToFit: true,
    },
    {
      field: "ins_cost",
      hide: true,
      cellRenderer: "numberRenderer",
      cellStyle: getCellStyle,
      suppressSizeToFit: true,
    },
    {
      field: "sworker_ins",
      hide: true,
      cellRenderer: "numberRenderer",
      cellStyle: getCellStyle,
      suppressSizeToFit: true,
    },
    {
      headerName: "예술/특고인경비",
      field: "total",
      editable: false,
      cellRenderer: "numberRenderer",
      width: 120,
      valueGetter: totalValueGetter,
      cellStyle: getCellStyle,
      suppressSizeToFit: true,
    },
    {
      headerName: "고용보험료",
      field: "ins_total",
      cellRenderer: "numberRenderer",
      editable: false,
      width: 100,
      valueGetter: totalInsValueGetter,
      cellStyle: getCellStyle,
      suppressSizeToFit: true,
    },
    {
      headerName: "산재보험료",
      field: "workinjury_ins",
      cellRenderer: "numberRenderer",
      editable: false,
      width: 100,
      cellStyle: getCellStyle,
      suppressSizeToFit: true,
    },
    {
      headerName: "차인지급액",
      field: "real_payment",
      cellRenderer: "numberRenderer",
      editable: false,
      width: 100,
      cellStyle: getCellStyle,
      suppressSizeToFit: true,
    },
  ];

  function reducer(state, action) {
    return {
      ...state,
      [action.name]: action.value,
    };
  }
  function getCellStyle(params) {
    if (params.value === 0 || undefined || null) {
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

  const [state, dispatch] = useReducer(reducer, {
    search_value: "",
  });
  const { search_value } = state;
  const onChange = (e) => {
    dispatch(e.target);
    const { value } = e.target;

    fetch("http://localhost:8080/input/earner_search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        worker_id: localStorage.getItem("worker_id"),
        search_value: value,
        payment_ym: parseInt(format(startDate.current, "yyyyMM")),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setEarnerRowData(data.earner_list);
      });
  };

  const [clickedCellInfo, setClickedCellInfo] = useState(null);
  const onCellClicked = useCallback(
    (event) => {
      setClickedCellInfo(event.data);
      const selectedRow = event.data;
      selectedCode.current = selectedRow.earner_code;
      setSelectedType(selectedRow.earner_type);
      if (selectedCode.current === undefined || null) {
        topGrid.current.api.setPinnedBottomRowData([]);
        setRowData([]);
      }

      fetch("http://localhost:8080/input/get_tax", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          worker_id: localStorage.getItem("worker_id"),
          earner_code: selectedCode.current,
          payment_ym: selectedRow.payment_ym,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          const sums = data.tax_list.reduce(
            (acc, curr) => ({
              totalPaymentSum: acc.totalPaymentSum + curr.total_payment,
              insCostSum: acc.insCostSum + curr.ins_cost,
              sworkerCostSum: acc.sworkerCostSum + curr.sworker_cost,
              sworkerinsSum: acc.sworkerinsSum + curr.sworker_ins,
              artistSum: acc.artistSum + curr.artist_cost,
              injurySum: acc.injurySum + curr.workinjury_ins,
              taxTotalSum: acc.taxTotalSum + curr.tax_total,
              taxLocalSum: acc.taxLocalSum + curr.tax_local,
              taxIncomeSum: acc.taxIncomeSum + curr.tax_income,
              realPaymentSum: acc.realPaymentSum + curr.real_payment,
              tuitionSum: acc.tuitionSum + curr.tuition_amount,
            }),
            {
              totalPaymentSum: 0,
              insCostSum: 0,
              artistSum: 0,
              taxTotalSum: 0,
              taxLocalSum: 0,
              taxIncomeSum: 0,
              tuitionSum: 0,
              realPaymentSum: 0,
              injurySum: 0,
              sworkerCostSum: 0,
              sworkerinsSum: 0,
            }
          );
          const {
            totalPaymentSum,
            taxTotalSum,
            injurySum,
            sworkerCostSum,
            sworkerinsSum,
            realPaymentSum,
            insCostSum,
            artistSum,
            taxLocalSum,
            taxIncomeSum,
            tuitionSum,
          } = sums;
          bottom.current = {
            payment_ym: "합계",
            total_payment: totalPaymentSum,
            tax_local: taxLocalSum,
            ins_total: sworkerinsSum + insCostSum,
            sworker_ins: sworkerinsSum,
            ins_cost: insCostSum,
            artist_cost: artistSum,
            sworker_cost: sworkerCostSum,
            tax_total: taxTotalSum,
            workinjury_ins: injurySum,
            total: artistSum + sworkerCostSum,
            real_payment: realPaymentSum,
            tax_income: taxIncomeSum,
            tuition_amount: tuitionSum,
          };

          console.log("합", bottom.current);
          topGrid.current.api.setPinnedBottomRowData([
            {
              payment_ym: "합계",
              total_payment: totalPaymentSum,
              tax_local: taxLocalSum,
              ins_total: sworkerinsSum + insCostSum,
              sworker_ins: sworkerinsSum,
              ins_cost: insCostSum,
              artist_cost: artistSum,
              sworker_cost: sworkerCostSum,
              tax_total: taxTotalSum,
              workinjury_ins: injurySum,
              total: artistSum + sworkerCostSum,
              real_payment: realPaymentSum,
              tax_income: taxIncomeSum,
              tuition_amount: tuitionSum,
            },
          ]);
          data.tax_list.push({});
          setWorkDate(data.select_date);
          setRowData(data.tax_list);
        });
    },
    [setClickedCellInfo, setSelectedType, setRowData, bottom]
  );

  function onRightCellValueChanged(event) {
    const { data, colDef } = event;
    const { field } = colDef;

    if (
      field === "payment_date" &&
      event.data.accrual_ym &&
      event.data.payment_ym
    ) {
      const newRowData = {};

      fetch("http://localhost:8080/input/update_taxdate", {
        method: "PATCH",
        body: JSON.stringify({
          tax_id: event.data.tax_id,
          payment_date: parseInt(data.payment_date),
          accrual_ym: event.data.accrual_ym,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((error) => {
              throw new Error(error.message);
            });
          }
          return response.json();
        })
        .then((datas) => {
          event.node.setDataValue("payment_date", parseInt(data.payment_date));
          topGrid.current.api.applyTransaction({ add: [newRowData] });
        })
        .catch((error) => {
          setError((prevErrors) => [...prevErrors, error.message]);
          event.node.setDataValue("payment_date", oldDate.current);
        });
    }

    if (field === "payment_ym" && data.accrual_ym && data.payment_ym) {
      fetch("http://localhost:8080/input/tax_insert", {
        method: "POST",
        body: JSON.stringify({
          payment_ym: data.payment_ym,
          worker_id: localStorage.getItem("worker_id"),
          earner_code: selectedCode.current,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data.tax_id);
          event.node.setDataValue("tax_id", data.tax_id);
          taxId.current = data.tax_id;
        })
        .then(
          fetch("http://localhost:8080/input/update_taxdate", {
            method: "PATCH",
            body: JSON.stringify({
              tax_id: taxId.current,
              payment_date: 1,
              accrual_ym: data.accrual_ym,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }).then((response) => {
            response.json();
          })
        );
    }
    if (field === "tax_rate" && data.total_payment && data.tax_rate) {
      fetch("http://localhost:8080/input/update_taxinfo", {
        method: "PATCH",
        body: JSON.stringify({
          tax_id: data.tax_id,
          total_payment: parseInt(data.total_payment),
          tax_rate: parseFloat(data.tax_rate),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((error) => {
              throw new Error(error.message);
            });
          }
          return response.json();
        })
        .then((data) => {
          console.log(data.earner_tax);
          event.node.setDataValue("tax_rate", data.earner_tax.tax_rate);
          event.node.setDataValue("tax_income", data.earner_tax.tax_income);
          event.node.setDataValue(
            "total_payment",
            data.earner_tax.total_payment
          );
          event.node.setDataValue("tax_local", data.earner_tax.tax_local);
          event.node.setDataValue("tax_total", data.earner_tax.tax_total);
          event.node.setDataValue("artist_cost", data.earner_tax.artist_cost);
          event.node.setDataValue("ins_cost", data.earner_tax.ins_cost);
          event.node.setDataValue("sworker_cost", data.earner_tax.sworker_cost);
          event.node.setDataValue("sworker_ins", data.earner_tax.sworker_ins);
          event.node.setDataValue(
            "workinjury_ins",
            data.earner_tax.workinjury_ins
          );
          event.node.setDataValue("real_payment", data.earner_tax.real_payment);
          event.node.setDataValue(
            "tuition_amount",
            data.earner_tax.tuition_amount
          );
          event.node.setDataValue("tax_id", data.earner_tax.tax_id);
        })
        .catch((error) => {
          setError((prevErrors) => [...prevErrors, error.message]);
        });
    }
  }

  const onEarnerGridSelection = useCallback(() => {
    const selectedEarnerRow = earnerGridRef.current.api.getSelectedRows();
    console.log(selectedEarnerRow[0]);
  }, []);

  const Tab = [
    {
      title: "자료입력",
      content: (
        <>
          <div
            id="right"
            style={{
              display: "flex",
              flexDirection: "column",
              flexWrap: "wrap",
              height: "605px",
              marginLeft: "5px",
              width: "99%",
            }}
            className="ag-theme-alpine"
          >
            <div style={{ flex: "1 1 auto" }}>
              <AgGridReact
                ref={topGrid}
                gridOptions={rightGridOptions}
                rowData={rowData}
                suppressSizeToFit={true}
                onGridReady={onRightGridReady}
                defaultColDef={defaultColDef}
                overlayLoadingTemplate={
                  '<span style="padding: 10px;">데이터가 없습니다</span>'
                }
                overlayNoRowsTemplate={
                  '<span style="padding: 10px;">데이터가 없습니다</span>'
                }
                columnDefs={columnDefs}
                frameworkComponents={frameworkComponents}
              />
            </div>
          </div>
        </>
      ),
    },
    {
      title: "단기예술/특고",
      content: (
        <div style={{ width: "2000px", marginLeft: "100px" }}>
          <Calendar
            payment_ym={format(startDate.current || new Date(), "yyyyMM")}
            worker_id={localStorage.getItem("worker_id")}
            earner_code={selectedCode.current}
            workDate={workDate}
          />
        </div>
      ),
    },
  ];

  const setData = useCallback(() => {
    fetch("http://localhost:8080/input/get_tax", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        worker_id: localStorage.getItem("worker_id"),
        earner_code: selectedCode.current,
        payment_ym: format(startDate.current, "yyyyMM"),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        topGrid.current.api.setPinnedBottomRowData([bottom]);
        data.tax_list.push({});
        setWorkDate(data.select_date);
        setRowData(data.tax_list);
      });
  }, [selectedCode.current, startDate.current, bottom]);
  const useTab = (idx, Tabs) => {
    if (!Tabs || !Array.isArray(Tabs)) {
      return null;
    }
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [currentIdx, setCurrentIdx] = useState(idx);
    return {
      currentItem: Tabs[currentIdx],
      changeItem: setCurrentIdx,
    };
  };
  const deleteCodes = useRef([]);
  function onRowSelected(event) {
    let earner_code = event.node.data.earner_code;
    let isSelected = event.node.isSelected();

    if (isSelected === true) {
      deleteCodes.current = [...deleteCodes.current, earner_code];
    } else if (isSelected === false) {
      deleteCodes.current = deleteCodes.current.filter(
        (code) => code !== earner_code
      );
    }
    props.setEarnerCodes(deleteCodes.current);
  }
  const handleStartDateChange = useCallback((date) => {
    startDate.current = date;
    setSelectedDate(date);
    console.log(date);
  }, []);
  const { currentItem, changeItem } = useTab(0, Tab);
  return (
    <>
      <ErrorAlert error={error} />
      <div id="container">
        <div id="header">
          <div
            style={{
              border: "1px solid black",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            <span style={{ width: "150px", marginLeft: "3rem" }}>지급년월</span>
            <DatePicker
              showIcon
              placeholderText="2022."
              selected={selectedDate}
              onChange={handleStartDateChange}
              minDate={new Date(2022, 0, 1)}
              maxDate={new Date(2022, 11, 31)}
              dateFormat="yyyy.MM"
              showMonthYearPicker
              locale={"ko"}
            />
            <button onClick={setDate} style={{ marginRight: "2rem" }}>
              {" "}
              조회
            </button>
          </div>
        </div>

        <div id="content">
          <div id="left">
            <div
              id="leftTop"
              className="ag-theme-alpine"
              style={{
                width: "95%",
                height: "400px",
                padding: "10px",
                marginLeft: 30,
              }}
            >
              <AgGridReact
                columnDefs={LeftColumnDefs}
                rowData={earnerData}
                suppressRowClickSelection={true}
                rowSelection={"multiple"}
                onGridReady={onEarnerGridReady}
                onSelectionChanged={onEarnerGridSelection}
                onCellClicked={onCellClicked}
                onRowSelected={onRowSelected}
                isRowSelectable={(params) => {
                  return !!params.data.earner_code;
                }}
                overlayLoadingTemplate={
                  '<span style="padding: 10px">데이터가 없습니다</span>'
                }
                overlayNoRowsTemplate={
                  '<span style="padding: 10px">데이터가 없습니다</span>'
                }
                ref={earnerGridRef}
              />
            </div>

            <div id="leftBottom">
              <table
                style={{
                  border: "1px solid lightgrey",
                  borderCollapse: "collapse", // 셀 경계선 병합
                  width: "465px",
                  marginRight: "90px",
                  height: "248px",
                }}
              >
                <thead></thead>
                <tbody>
                  <tr>
                    <td
                      className="total"
                      style={{
                        width: "10%",
                        writingMode: "vertical-rl",
                        textOrientation: "upright",
                      }}
                      rowSpan="9"
                    >
                      총 계
                    </td>
                  </tr>
                  <tr>
                    <th style={{ width: "40%" }} scope="row">
                      인원[건수]
                    </th>
                    <td
                      style={{
                        width: "40%",
                        textAlign: "right",
                      }}
                    >
                      {earnerCount || "0"}[{sumTask.count || "0"}]
                    </td>
                    <td className="label" style={{ width: "10%" }}>
                      명
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">지급액</th>
                    <td style={{ width: "40%", textAlign: "right" }}>
                      {sumTask.total_payment
                        ? sumTask.total_payment.toLocaleString()
                        : 0}
                    </td>
                    <td className="label">원</td>
                  </tr>
                  <tr>
                    <th scope="row">학자금상환액</th>
                    <td style={{ width: "40%", textAlign: "right" }}>
                      {sumTask.tuition_amount
                        ? sumTask.tuition_amount.toLocaleString()
                        : "0"}
                    </td>
                    <td className="label">원</td>
                  </tr>
                  <tr>
                    <th scope="row">소득세</th>
                    <td style={{ width: "40%", textAlign: "right" }}>
                      {sumTask.tax_income
                        ? sumTask.tax_income.toLocaleString()
                        : "0"}
                    </td>
                    <td className="label">원</td>
                  </tr>
                  <tr>
                    <th scope="row">지방소득세</th>
                    <td style={{ width: "40%", textAlign: "right" }}>
                      {sumTask.tax_local
                        ? sumTask.tax_local.toLocaleString()
                        : "0"}
                    </td>
                    <td className="label">원</td>
                  </tr>
                  <tr>
                    <th scope="row">고용보험료</th>
                    <td style={{ width: "40%", textAlign: "right" }}>
                      {sumTask.ins_cost + sumTask.sworker_ins
                        ? (
                            sumTask.ins_cost + sumTask.sworker_ins
                          ).toLocaleString()
                        : "0"}
                    </td>
                    <td className="label">원</td>
                  </tr>
                  <tr>
                    <th scope="row">산재보험료</th>
                    <td style={{ width: "40%", textAlign: "right" }}>
                      {sumTask.workinjury_ins
                        ? sumTask.workinjury_ins.toLocaleString()
                        : "0"}
                    </td>
                    <td className="label">원</td>
                  </tr>
                  <tr>
                    <th scope="row">차인지급액</th>
                    <td style={{ width: "40%", textAlign: "right" }}>
                      {sumTask.real_payment
                        ? sumTask.real_payment.toLocaleString()
                        : "0"}
                    </td>
                    <td className="label">원</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div
            style={{
              float: "left",
              marginLeft: "10px",
              marginRight: "10px",
              marginTop: "-30px",
              width: "100%",
              height: "1000px",
            }}
          >
            <button
              key={0}
              onClick={(e) => {
                changeItem(0);
                setData();
              }}
              style={{ width: "150px", marginLeft: 5 }}
            >
              자료입력
            </button>

            {selectedType === "단기" && (
              <button
                key={1}
                onClick={(e) => {
                  changeItem(1);
                  setData();
                }}
                style={{ width: "170px" }}
              >
                예술/노무(특고)등록
              </button>
            )}
            {currentItem === Tab[1] && selectedType !== "단기" && changeItem(0)}
            {currentItem.content}
          </div>

          <ReactModal
            style={customStyles}
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
          >
            {
              <>
                <h4>사업소득자 코드도움</h4>
                <div
                  className="ag-theme-alpine"
                  style={{ height: 400, width: 805 }}
                >
                  <AgGridReact
                    columnDefs={EarnerColumn}
                    rowData={EarnerRowData}
                    rowSelection={"single"}
                    onCellDoubleClicked={EarnerModalDoubleClicked}
                    ref={gridRef}
                  />
                </div>

                <>
                  <div style={{ textAlign: "center" }}>
                    찾을 내용{" "}
                    <input
                      type="text"
                      name="search_value"
                      style={{
                        width: "500px",
                        borderColor: "skyblue",
                        outline: "none",
                      }}
                      value={search_value}
                      onChange={onChange}
                    ></input>
                    <br />
                    <button onClick={() => setIsModalOpen(false)}>취소</button>
                    <button onClick={EarnerModalDoubleClicked}>확인</button>
                  </div>
                </>
              </>
            }
          </ReactModal>
        </div>
      </div>
    </>
  );
};
export default IncomeInput2;
