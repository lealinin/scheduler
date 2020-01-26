import React, { useState, useEffect } from "react";
import axios from "axios";

import DayList from "./DayList";
import Appointment from "components/Appointment";
import { getAppointmentsForDay, getInterviewersForDay, getInterview } from "../helpers/selectors";

import "components/Application.scss";

// Hard-coded days array

// const days = [
//   {
//     id: 1,
//     name: "Monday",
//     spots: 2,
//   },
//   {
//     id: 2,
//     name: "Tuesday",
//     spots: 5,
//   },
//   {
//     id: 3,
//     name: "Wednesday",
//     spots: 0,
//   },
// ];

// Hard-coded appointments array

// const appointments = [
//   {
//     id: 1,
//     time: "12pm",
//   },
//   {
//     id: 2,
//     time: "1pm",
//     interview: {
//       student: "Lydia Miller-Jones",
//       interviewer: {
//         id: 1,
//         name: "Sylvia Palmer",
//         avatar: "https://i.imgur.com/LpaY82x.png",
//       }
//     }
//   },
//   {
//     id: 3,
//     time: "2pm",
//     interview: {
//       student: "Sally Greennails",
//       interviewer: {
//         id: 2,
//         name: "Tori Malcolm",
//         avatar: "https://i.imgur.com/Nmx0Qxo.png",
//       }
//     }
//   },
//   {
//     id: 4,
//     time: "4pm",
//     interview: {
//       student: "Bill Withers",
//       interviewer: {
//         id: 4,
//         name: "Cohana Roy",
//         avatar: "https://i.imgur.com/FK8V841.jpg",
//       }
//     }
//   },
//   {
//     id: 5,
//     time: "3pm",
//     interview: {
//       student: "Bonnie Clyde",
//       interviewer: {
//         id: 5,
//         name: "Sven Jones",
//         avatar: "https://i.imgur.com/twYrpay.jpg",
//       }
//     }
//   }
// ];


export default function Application(props) {
  // const [day, setDay] = useState("Monday");
  // const [days, setDays] = useState([]);
  // console.log(day);

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    // interviewers: []
  });

  const setDay = day => setState(prev => ({ ...state, day }));
  // const setDays = days => setState(prev => ({ ...state, days }));

  useEffect(() => {
    const daysPromise = axios.get('/api/days');
    const appointPromise = axios.get('/api/appointments');
    const interviewerPromise = axios.get('/api/interviewers');

    Promise.all([daysPromise, appointPromise, interviewerPromise]).then((all) => {
      console.log(all);
      setState({ ...state, days: all[0].data, appointments: all[1].data, interviewers: all[2].data });
    });

  }, []);

  function bookInterview(id, interview) {

    const appointment = {
      ...state.appointments[id], // new app obj with interview id
      interview: { ...interview } // clone the interview obj
    }

    const appointments = {
      ...state.appointments,
      [id]: appointment
    }

    return axios
      .put(`/api/appointments/${id}`, { interview })
      .then(() => {
        setState({
          ...state,
          appointments
        });
      });
  }

  // that will use the appointment id to find the right appointment slot and set it's interview data to null

  function cancelInterview(id, interview) {

    const appointment = {
      ...state.appointments[id],
      interview: interview && { ...interview }
    }

    const appointments = {
      ...state.appointments,
      [id]: appointment
    }

    return axios
      .delete(`/api/appointments/${id}`, { interview: null })
      .then(() => {
        setState({
          ...state,
          appointments
        });
      });

  }

  const appointments = getAppointmentsForDay(state, state.day);
  const interviewers = getInterviewersForDay(state, state.day);

  const schedule = appointments.map((appointment) => {
    const interview = getInterview(state, appointment.interview);

    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={interview}
        interviewer={appointment.interviewer}
        interviewers={interviewers}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
      // interviewers={[]}
      // interviewers={state.interviewers}
      />
    );
  });

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            day={state.day}
            setDay={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {schedule}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
