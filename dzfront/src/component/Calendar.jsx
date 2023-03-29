import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import '../css/Calendar.css';
import { format, toDate, addMonths, subMonths } from 'date-fns';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import { isSameMonth, addDays, parse } from 'date-fns';
import { AgCheckbox } from 'ag-grid-community';

const RenderHeader = ({ Month }) => {
    return (
        <div className="header row">
            <div className="col col-start">
                <span className="text">
                    <span className="text month">
                        {format(Month, 'yyyy')}년  
                    </span>
                    {format(Month, 'M')}월
                </span>
                
            </div>
            {/* <div className="col col-end">
                <Icon icon="bi:arrow-left-circle-fill" onClick={prevMonth} />
                <Icon icon="bi:arrow-right-circle-fill" onClick={nextMonth} />
            </div> */}
        </div>
        
    );
};

const RenderDays = () => {
    const days = [];
    const date = [ 'check', 'Sun', 'Mon', 'Thu', 'Wed', 'Thrs', 'Fri', 'Sat'];

    
    for (let i = 0; i < 8; i++) {
        if(i==0){
            days.push(
                <div className="col" key={i} style={{width:"50px"}}>
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




const Rendercell = ({ currentMonth, onDateClick }) => {
    const monthStart = startOfMonth(currentMonth);//해당 월의 첫 날짜 리턴
    const monthEnd = endOfMonth(monthStart);//해당 월의 마지막 날짜 리턴
    const startDate = startOfWeek(monthStart);//currentmonth의 첫번째 주 첫번쨰 날짜 리턴
    const endDate = endOfWeek(monthEnd);//currentmonth의 마지막 주 마지막 날짜 리턴
    const [selectedList, setSelectedList] = useState([]);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    const rowCheck = e => {
        let checkbox = e.target;
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
        //.;
    }

    while (day <= endDate) {
        for (let i = 1; i < 8; i++) {
            
            formattedDate = format(day, 'd');
            const cloneDay = day;
            days.push(
                <div
                    className={`col cell ${
                        !isSameMonth(day, monthStart)
                            ? 'disabled'
                            : selectedList.includes(format(day,'yyyy-MM-dd'))
                            ? 'selected'
                            : format(currentMonth, 'M') !== format(day, 'M')
                            ? 'not-valid'
                            : 'valid'
                    } ${format(day, 'E')}`}//달력에 현재 날짜 표시 여부
                    key={day}
                    onClick={() => {
                    onDateClick(toDate(parse(cloneDay, 'yyyy-MM-dd', new Date())));//날짜 클릭시 해당 날짜를 파싱
                    const selectedDateInput = format(toDate(cloneDay), 'yyyy-MM-dd');
                    console.log(selectedDateInput); // 선택된 날짜를 콘솔에 출력
                    setSelectedList(prevList => {
                        const selectedDateInput = format(toDate(cloneDay), 'yyyy-MM-dd');
                        if(!isSameMonth(cloneDay, monthStart)){
                            return prevList
                        } else{
                            if (prevList.includes(selectedDateInput)) {
                                const newList = prevList.filter(date => date !== selectedDateInput);
                                console.log(newList);
                                return newList; // 중복된 값이 있는 경우, 중복된 값을 제외한 새로운 배열 반환
                            } else {
                            const newList = [...prevList, selectedDateInput];
                            console.log(newList);
                            return newList; // 중복된 값이 없는 경우 새로운 값을 추가한 배열 반환
                            }
                        }
                        });
                  }}
                >
                    <span
                        className={
                            format(currentMonth, 'M') !== format(day, 'M')
                                ? 'text not-valid'
                                : ''
                        }//보고 있는 달을 텍스트에 저장
                    >
                        {formattedDate}
                    </span>
                </div>,
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
      //<input type="checkbox">주말 포함</input>
    const CheckWeekend =({ onCheckWeekend }) => {
        return(
            <AgCheckbox onClick={onCheckWeekend}>주말 포함</AgCheckbox>
        );
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
        const days = [];
        const selectedDates = [];
        
        // 해당 달의 날짜들을 모두 selectedDates에 추가
        //주말포함
        if(isChecked){
            while (day <= lastDayOfMonth) {
                if (day.getDay() != 6 && day.getDay() != 0) {
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
        console.log(selectedDates);
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


export const Calendar = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [commingMonth, setCommingMonth] = useState(addMonths(new Date(), 1));
    const [selectedDate, setSelectedDate] = useState(new Date());

    const onDateClick = (day) => {
        setSelectedDate(day);
    };
    return (
        <div className="calendar" style={{flexDirection:"row"}}>
            <RenderHeader
                Month={currentMonth}
            />
           <RenderDays />
            <Rendercell
                currentMonth={currentMonth}
                selectedDate={selectedDate}
                onDateClick={onDateClick}
            />
            <RenderHeader
                Month={commingMonth}
            />
           <RenderDays />
            <Rendercell
                currentMonth={commingMonth}
                selectedDate={selectedDate}
                onDateClick={onDateClick}
            />
    
        </div>
    );
};

export default Calendar;