"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import React, { Suspense, useRef, useState } from "react";
import { formatDate } from "@fullcalendar/core";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayjs from "dayjs";
import { currentWeek, endDayWeek, startDayWeek } from "./lib/constants";
import { DatePicker, Select, Space } from "antd";
import { cn, getRandomColor } from "./lib/utils";

const { RangePicker } = DatePicker;
export default function Home() {
  const [currentEvents, setCurrentEvents] = useState([]);
  const calendarRef = useRef(null);
  const [title, setTitle] = useState(currentWeek);
  const [startDay, setStartDay] = useState(startDayWeek);
  const [endDay, setEndDay] = useState(endDayWeek);

  function handleDateSelect(selectInfo) {
    let title = prompt("Please enter a new title for your event");
    let calendarApi = selectInfo.view.calendar;
    const colorRandom = getRandomColor();
    calendarApi.unselect();
    if (title) {
      calendarApi.addEvent({
        id: 1,
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        backgroundColor: colorRandom,
        allDay: selectInfo.allDay,
      });
    }
  }

  function handleEventClick(clickInfo) {
    if (
      confirm(
        `Are you sure you want to delete the event '${clickInfo.event.title}'`
      )
    ) {
      clickInfo.event.remove();
    }
  }

  function handleEvents(events) {
    setCurrentEvents(events);
  }

  function handleDatesSet(dateInfo) {
    const startOfWeek = dayjs(dateInfo.start).format("MMM D");
    const endOfWeek = dayjs(dateInfo.end).format("MMM D, YYYY");
    const fullOfWeek = `${startOfWeek} - ${endOfWeek}`;
    setTitle(fullOfWeek);
  }

  const handleRangeChange = (dates) => {
    if (dates) {
      const calendarApi = calendarRef.current.getApi();
      const [start, end] = dates;
      calendarApi.gotoDate(dayjs(start).toISOString());
    }
  };

  function goNext() {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.next();
  }
  function goPrevious() {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.prev();
  }
  function goToday() {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.today();
  }
  function goMonth() {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.changeView("dayGridMonth");
  }
  function goDay() {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.changeView("timeGridDay");
  }
  function goWeek() {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.changeView("timeGridWeek");
  }

  const handleChange = (value: string) => {
    switch (value) {
      case "week":
        goWeek();
        break;
      case "day":
        goDay();
        break;
      case "month":
        goMonth();
        break;
      default:
        break;
    }
  };

  return (
    <div className="demo-app">
      <div
        className="demo-app-main"
        style={{
          maxWidth: "1120px",
          margin: "40px auto",
        }}
      >
        <div className="flex justify-between">
          <Select
            defaultValue="week"
            style={{ width: 120, height: 40 }}
            onChange={handleChange}
            options={[
              { value: "day", label: "Day" },
              { value: "week", label: "Week" },
              { value: "month", label: "Month" },
            ]}
          />
          {/* DATEPICKER */}
          <div className="flex">
            <div
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border-neutral-400 cursor-pointer border-r-[1px]"
              onClick={goPrevious}
            >
              {"<"}
            </div>
            <div
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border-neutral-500 cursor-pointer"
              onClick={goToday}
            >
              Today
            </div>

            <RangePicker
              defaultValue={[startDay, endDay]}
              format={"DD/MM/YYYY"}
              onChange={handleRangeChange}
              className="rounded-none"
            />
            <div
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border-neutral-500 cursor-pointer"
              onClick={goNext}
            >
              {">"}
            </div>
          </div>
        </div>
        {/* GRID CALENDAR */}
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            start: "",
            center: "",
            end: "",
          }}
          initialView="timeGridWeek"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          slotEventOverlap={true}
          nowIndicator={true}
          initialEvents={[
            {
              id: "event 1",
              title: "event 1",
              start: "2024-10-01T10:00:00",
              end: "2024-10-01T12:00:00",
            },
            {
              id: "event 2",
              title: "event 2",
              start: "2024-10-02T14:00:00",
              end: "2024-10-02T15:30:00",
            },
          ]}
          customButtons={{
            dateTimePicker: {
              text: `${title}`,
              click: (arg) => {
                console.log("click", arg);
              },
            },
          }}
          select={handleDateSelect}
          eventContent={renderEventContent}
          eventClick={handleEventClick}
          eventsSet={handleEvents}
          datesSet={handleDatesSet} // Add the datesSet handler
        />
      </div>
    </div>
  );
}

function renderEventContent(eventInfo) {
  return (
    <div className={`flex gap-2 ${eventInfo.event.backgroundColor}`}>
      <i>{eventInfo.event.title}</i>
      {/* <b>
        {startTime} - {endTime}
      </b> */}
    </div>
  );
}
