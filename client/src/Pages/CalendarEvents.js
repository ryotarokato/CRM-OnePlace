import React, { useEffect, useState, useContext } from "react";
import "./Styles/calendar.css";
import axios from "axios";
import DatePicker from "react-date-picker";
import { AuthLoginInfo } from "./../AuthComponents/AuthLogin";
import InsertInvitationRoundedIcon from "@mui/icons-material/InsertInvitationRounded";
import TitleRoundedIcon from "@mui/icons-material/TitleRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";

function checkIfNextDay(nextDay) {
  var tommorow = new Date();
  tommorow.setDate(tommorow.getDate() + 1);
  var tommorowDate = formatDate(tommorow);
  console.log(nextDay, tommorowDate);
  if (nextDay === tommorowDate) {
    return true;
  } else {
    return false;
  }
}

function checkIfNextDayIso(nextDay) {
  const tommorow = new Date();
  tommorow.setDate(tommorow.getDate() + 1);
  const tommorowDate = tommorow.toISOString().split("T")[0];
  if (nextDay === tommorowDate) {
    return true;
  } else {
    return false;
  }
}

function formatDate(date, checkNextDay = false) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();
  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  var convertedDate = [year, month, day].join("-");
  if (checkNextDay === true) {
    if (checkIfNextDay(convertedDate)) {
      return (
        <span
          style={{
            color: "green",
          }}
        >
          Tommorow
        </span>
      );
    }
  }
  return convertedDate;
}

function formatIsoDate(date, checkNextDay = false) {
  const convertedDate = date.split("T")[0];
  if (checkNextDay === true) {
    if (checkIfNextDayIso(convertedDate)) {
      return (
        <span
          style={{
            color: "green",
          }}
        >
          Tommorow
        </span>
      );
    }
  }
  return convertedDate;
}

function CalendarEvents() {
  const [eventsData, setEventsData] = useState();
  const [newEventSubmitted, setNewEventSubmitted] = useState(false);
  const ctx = useContext(AuthLoginInfo);

  useEffect(() => {
    axios
      .get("http://localhost:5000/events", { withCredentials: true })
      .then((res) => {
        if (res.data != null) {
          setNewEventSubmitted(false);
          setEventsData(res.data);
        }
      });
  }, [newEventSubmitted]);

  const addNewEvent = (eventData) => {
    axios
      .post(
        "http://localhost:5000/newevent",
        {
          eventData,
        },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.data === "success") {
          setNewEventSubmitted(true);
        }
      });
  };

  const CalendarWrap = (props) => {
    return (
      <div className="calendarWrap">
        <div className="calendarHeader">
          <h1>Event calendar</h1>
        </div>
        <div className="calendarColumns">{props.children}</div>
      </div>
    );
  };

  const NewEvent = () => {
    const [newEventData, setNewEventData] = useState({
      title: "",
      calendarPickDate: new Date(),
      deadlineDate: formatDate(new Date()),
      addDate: formatDate(new Date()),
      hours: "",
      details: "",
      worker: ctx.username,
    });

    return (
      <div className="newEventWrap">
        <h3>Add new event</h3>
        <div className="newEventRowWrap">
          <div className="newEventGroup">
            <div className="newEventDate">
              <button className="newEventDateButton">
                <TitleRoundedIcon />
              </button>
              <div className="newEventDateContainer">
                <label className="newEventDateLabel">Title</label>
                <input
                  type="text"
                  className="newEventDateInput"
                  value={newEventData.title}
                  onChange={(e) => {
                    setNewEventData({
                      ...newEventData,
                      title: e.target.value,
                    });
                  }}
                />
              </div>
            </div>

            <div className="newEventDate">
              <button className="newEventDateButton">
                <InsertInvitationRoundedIcon />
              </button>
              <div className="newEventDateContainer">
                <label className="newEventDateLabel">Pick date</label>
                <DatePicker
                  onChange={(date) => {
                    setNewEventData({
                      ...newEventData,
                      deadlineDate: formatDate(date),
                      calendarPickDate: date,
                    });
                  }}
                  value={newEventData.calendarPickDate}
                  className="newEventDateInput calendar"
                />
              </div>
            </div>

            <div className="newEventDate">
              <button className="newEventDateButton">
                <HelpOutlineRoundedIcon />
              </button>
              <div className="newEventDateContainer">
                <label className="newEventDateLabel">Details</label>
                <input
                  type="text"
                  className="newEventDateInput"
                  value={newEventData.details}
                  onChange={(e) => {
                    setNewEventData({
                      ...newEventData,
                      details: e.target.value,
                    });
                  }}
                />
              </div>
            </div>

            <div className="newEventDate">
              <button className="newEventDateButton">
                <AccessTimeRoundedIcon />
              </button>
              <div className="newEventDateContainer">
                <label className="newEventDateLabel">Specify hours</label>
                <input
                  type="text"
                  className="newEventDateInput"
                  value={newEventData.hours}
                  onChange={(e) => {
                    setNewEventData({
                      ...newEventData,
                      hours: e.target.value,
                    });
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="newEventGroup">
          <button
            className="addOrder"
            onClick={() => {
              addNewEvent(newEventData);
              setNewEventData({
                title: "",
                calendarPickDate: new Date(),
                deadlineDate: formatDate(new Date()),
                addDate: formatDate(new Date()),
                hours: "",
                details: "",
                worker: ctx.username,
              });
            }}
          >
            <AddCircleOutlineRoundedIcon />
            <span className="addOrderText">Create</span>
          </button>
        </div>
      </div>
    );
  };

  const EventsTable = () => {
    const [filterOrders, setFilterOrders] = useState("Current");

    const sortedEventsData = eventsData?.sort((a, b) => {
      return new Date(b.deadlineDate) - new Date(a.deadlineDate);
    });
    const upToDateEventsData = [];
    const oldDateEventsData = [];

    sortedEventsData?.forEach((value) => {
      const dateToCompare = new Date();
      dateToCompare.setHours(0, 0, 0, 0);
      const actualDate = new Date(value.deadlineDate);
      if (actualDate >= dateToCompare) {
        upToDateEventsData.push(value);
      } else {
        oldDateEventsData.push(value);
      }
    });

    return (
      <div className="eventsTableWrap">
        <div className="orderNav calendarNav">
          <ul>
            <li
              className={`${filterOrders === "Current" ? "active" : ""}`}
              onClick={() => {
                setFilterOrders("Current");
              }}
            >
              Current events
            </li>
            <li
              className={`${filterOrders === "Expired" ? "active" : ""}`}
              onClick={() => {
                setFilterOrders("Expired");
              }}
            >
              Expired events
            </li>
          </ul>
        </div>
        <table className="eventsTable">
          <thead>
            <tr className="eventsTableTdTh">
              <th></th>
              <th>Title</th>
              <th>Details</th>
              <th>Term</th>
              <th>Date created</th>
              <th>Added by</th>
            </tr>
          </thead>
          <tbody>
            {(filterOrders === "Expired"
              ? oldDateEventsData
              : upToDateEventsData
            )
              ?.map((el) => {
                return (
                  <tr className="eventsTableTdTr" key={el.id}>
                    <td className="eventsTableIcon">
                      <CheckCircleOutlineRoundedIcon />
                    </td>
                    <td>{el.title}</td>
                    <td>{el.details}</td>
                    <td>
                      {formatIsoDate(el.deadlineDate, true)}
                      <span className="eventsTableHours">{el.hours}</span>
                    </td>
                    <td>{formatIsoDate(el.addDate)}</td>
                    <td>{el.worker}</td>
                  </tr>
                );
              })
              .reverse()}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="bodyWrap">
      <CalendarWrap>
        <NewEvent />
        <EventsTable />
      </CalendarWrap>
    </div>
  );
}

export default CalendarEvents;
