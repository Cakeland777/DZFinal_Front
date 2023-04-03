import React, { useState} from 'react';
import '../css/Calendar.css';
import { format, addMonths} from 'date-fns';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import { isSameMonth, addDays, parse } from 'date-fns';



const RenderHeader = ({ Month }) => {
    return (
        <div className="header row">
            <div className="col col-start">
                <span className="text">
                    <span className="text month">
                        {format(Month, 'yyyy')}년  
                    </span>
                    {format(Month, 'MM')}월
                </span>
                
            </div>
        </div>
        
    );
};

const RenderDays = () => {
    const days = [];
    const date = [ 'check', 'Sun', 'Mon', 'Thu', 'Wed', 'Thrs', 'Fri', 'Sat'];

    
    for (let i = 0; i < 8; i++) {
        if(i===0){
            days.push(
                <div className="col" key={i} style={{width:"50px"}}>
                    {date[i]}
                </div>,
            );
        }
        else if(i===1){
            days.push(
                <div className="col" key={i} style={{color :"red"}} >
                    {date[i]}
                </div>,
            );
        }
        else if(i===7){
            days.push(
                <div className="col" key={i} style={{color :"blue"}} >
                    {date[i]}
                </div>,
            );
        }
        else{
            days.push(
                <div className="col" key={i} >
                    {date[i]}
                </div>,
            );
        }
    }

    return <div className="days row">{days}</div>;
};
// 모든 날짜 선택 해제
const ResetButton = ({ onReset }) => {
    return (
      <button onClick={onReset}>일괄 해제</button>
    );
  };




const Rendercell = ({ currentMonth, onDateClick, WorkDay, worker_id, earner_code, payment_ym}) => {
    const monthStart = startOfMonth(currentMonth);//해당 월의 첫 날짜 리턴
    const monthEnd = endOfMonth(monthStart);//해당 월의 마지막 날짜 리턴
    const startDate = startOfWeek(monthStart);//currentmonth의 첫번째 주 첫번쨰 날짜 리턴
    const endDate = endOfWeek(monthEnd);//currentmonth의 마지막 주 마지막 날짜 리턴
    const [selectedList, setSelectedList] = useState(WorkDay);
   
    let mapDate={};
    //console.log(WorkDay);
    WorkDay.forEach(item => 
            mapDate[item] = item)

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    const sendDate = divBody => {
        const selectedDateList = divBody.querySelectorAll(".selected"); 
        const dateList={};
        // selectedDateList.forEach(item => {
        //     const dataDate = item.getAttribute("data-date");
        //     dateList[dataDate];
        // });
        const selectedDates = Array.from(selectedDateList, item => item.getAttribute("data-date"));
        // console.log(divBody);
        // console.log(selectedDateList.getAttribute);
        console.log(selectedDates);
        
        fetch("http://localhost:8080/input/calendar_insert", {                         
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                worker_id: worker_id,
                earner_code:earner_code,
                payment_ym:payment_ym,
                select_dates:selectedDates
            }),
            })
            .then((response) => response.json())
            .then((data) => {
        });
    
    }

    const rowCheck = e => {
        let checkbox = e.target;
        const selectedDates=[];
        if (checkbox.checked) {
           for(let i =0;i<7;i++) {
                let arr = checkbox.parentNode.querySelector(".valid");
                arr.classList.remove("valid");
                arr.classList.add("selected");
            }
            
        } else {    
            for(let i =0;i<7;i++){
                let arr = checkbox.parentNode.querySelector(".selected");
                arr.classList.remove("selected");
                arr.classList.add("valid");
            }
        }
        sendDate(checkbox.parentNode.parentNode);
    }
    const dateCheck = (e) => {
        let dateClick = e.target;
    
        if (dateClick.classList.contains("valid")) {
            dateClick.classList.remove("valid");
            dateClick.classList.add("selected");
        } else {    
            dateClick.classList.remove("selected");
            dateClick.classList.add("valid");
        }
        sendDate(dateClick.parentNode.parentNode)
    }
    
    const holidays = [
        "2022-01-01", // 신정
        "2022-02-01", // 설날
        "2022-02-02", // 설날
        "2022-02-03", // 설날
        "2022-03-01", // 삼일절
        "2022-05-05", // 어린이날
        "2022-06-06", // 현충일
        "2022-08-15", // 광복절
        "2022-09-09", // 추석
        "2022-09-10", // 추석
        "2022-09-11", // 추석
        "2022-10-03", // 개천절
        "2022-10-09", // 한글날
        "2022-12-25" // 성탄절
      ];

    while (day <= endDate) {
        for (let i = 1; i < 8; i++) {
          
            formattedDate = format(day, 'd');
            const cloneDay = day;
            const accrual_date = format(day, 'yyyyMM');
            const calendar_day = format(day,'yyyy-MM-dd');
            days.push(
                <div
                className={`col cell ${
                    !isSameMonth(day, monthStart)
                        ? 'disabled'
                        : selectedList.includes(calendar_day)
                        ? 'selected'
                        : format(currentMonth, 'M') !== format(day, 'M')
                        ? 'not-valid'
                        : 'valid'
                        
                } ${format(day, 'E')} ${holidays.includes(calendar_day) ? 'holiday' : ''}`}//달력에 현재 날짜 표시 여부
                onClick= {dateCheck}
                
                data-date={calendar_day}
                >
                        {formattedDate}
                    
                </div>
            );
            day = addDays(day, 1);
   
        }
        rows.push(
            <div className="row" key={day}>
                <input type="checkbox" style={{width:"60px"}} onClick={rowCheck} />
                {days}
            </div>
        );
        days = [];
    }
    


    const handleResetClick = () => {
        setSelectedList([]);
      };
    //모든 날짜 선택
    const SelectAllButton = ({ onSelectAllClick }) => {
        return (
            <button onClick={onSelectAllClick}>일괄 선택</button>
        );
    };
     // 해당 달의 모든 날짜 선택
    const handleWeekClick = () => {
        const firstDayOfMonth = startOfMonth(currentMonth);
        const lastDayOfMonth = endOfMonth(currentMonth);
        let day = firstDayOfMonth;
        const selectedDates = [];
        
        // 해당 달의 날짜들을 모두 selectedDates에 추가
        //주말포함
        if(isChecked){
            while (day <= lastDayOfMonth) {
                if (day.getDay() !== 6 && day.getDay() !== 0) {
                    const selectedDate = format(day, 'yyyy-MM-dd');
                    selectedDates.push(selectedDate);
                  }
                  day = addDays(day, 1);
            }
        }
        //주말미포함
        else{
        while (day <= lastDayOfMonth) {
            const selectedDate = format(day, 'yyyy-MM-dd');
            selectedDates.push(selectedDate);
            day = addDays(day, 1);
            }
        }
        // 모든 날짜를 선택할 경우, selectedDates를 setSelectedList에 전달
        setSelectedList(selectedDates);
        //console.log(selectedDates);
        fetch("http://localhost:8080/input/calendar_insert", {                         
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                worker_id: worker_id,
                earner_code:earner_code,
                payment_ym:payment_ym,
                select_dates:selectedDates
            }),
            })
            .then((response) => response.json())
            .then((data) => {
        });
  };
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    };

    return(
    <div> 
        <div className="body">{rows}</div>
        <SelectAllButton onSelectAllClick={() => handleWeekClick(true)} />
        <ResetButton onReset={handleResetClick} />
        <label htmlFor="excludeWeekends">주말 제외</label>
        <input type="checkbox" id="excludeWeekends" name="excludeWeekends" checked={isChecked} onChange={handleCheckboxChange}/>    
    </div>
    );
};


export const Calendar = ({payment_ym, workDate, worker_id, earner_code}) => {
    //payment_ym="202202";
    
    const [currentMonth, setCurrentMonth] = useState(parse(payment_ym, "yyyyMM", new Date()));
    const [commingMonth, setCommingMonth] = useState(addMonths(parse(payment_ym, "yyyyMM", new Date()), -1));
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [Workerid, setWorkerid] = useState(worker_id);
    const [Earnercode, setEarnercode] = useState(earner_code);

    const onDateClick = (day) => {
        setSelectedDate(day);
    };

    console.log("여기",worker_id);
    console.log("여기",earner_code);
   
    return (
        <div  style={{display:"flex"}}>
            <div className="calendar" style={{flexDirection:"row", width:"20%"}}>
                <RenderHeader
                    Month={commingMonth}
                />
            <RenderDays />
                <Rendercell
                    currentMonth={commingMonth}
                    selectedDate={selectedDate}
                    onDateClick={onDateClick}
                    worker_id={Workerid}
                    earner_code={Earnercode}
                    payment_ym={payment_ym}
                    WorkDay={workDate}
                />
            </div>
            <div className="calendar" style={{flexDirection:"row", width:"20%"}}>
                <RenderHeader
                        Month={currentMonth}
                    />
                <RenderDays />
                <Rendercell
                    currentMonth={currentMonth}
                    selectedDate={selectedDate}
                    onDateClick={onDateClick}
                    worker_id={Workerid}
                    earner_code={Earnercode}
                    payment_ym={payment_ym}
                    WorkDay={workDate}
                />
            </div>
        </div>

    );
};

export default Calendar;