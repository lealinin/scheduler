import { useReducer, useEffect } from "react";
import axios from "axios";


const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

function reducer(state, action) {
  switch (action.type) {
    case SET_DAY:
      return { ...state, day: action.day }
    case SET_APPLICATION_DATA:
      return { ...state, days: action.days, appointments: action.appointments, interviewers: action.interviewers }
    case SET_INTERVIEW: {

      let appointment = {}

      if (action.interview) {
        appointment = { ...state.appointments[action.id], interview: { ...action.interview } }
      } else {
        appointment = { ...state.appointments[action.id], interview: action.interview }
      }

      const appointments = { ...state.appointments, [action.id]: appointment }

      const updateSpots = state.days.map((day) => {
        for (let appointment of day.appointments) {
          if (action.id === appointment) {
            if (action.interview && !state.appointments[action.id].interview) {
              return { ...day, spots: day.spots - 1 };
            } else if (!action.interview && state.appointments[action.id].interview) {
              return { ...day, spots: day.spots + 1 };
            }
          }
        }
        return day
      })
      return { ...state, appointments, days: updateSpots }

    }
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}

export default function useApplicationData(initial) {

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => dispatch({ type: SET_DAY, day });


  useEffect(() => {
    const daysPromise = axios.get('/api/days');
    const appointPromise = axios.get('/api/appointments');
    const interviewerPromise = axios.get('/api/interviewers');

    Promise.all([daysPromise, appointPromise, interviewerPromise]).then((all) => {
      console.log(all);
      dispatch({ type: SET_APPLICATION_DATA, days: all[0].data, appointments: all[1].data, interviewers: all[2].data });
    });

  }, []);

  function bookInterview(id, interview) {

    return axios
      .put(`/api/appointments/${id}`, { interview })
      .then(() => {
        console.log(interview);
        dispatch({
          type: SET_INTERVIEW,
          id,
          interview
        })
      });
  }

  function cancelInterview(id) {

    return axios
      .delete(`/api/appointments/${id}`)
      .then(() => {
        dispatch({
          type: SET_INTERVIEW,
          id,
          interview: null
        });
      });
  }

  return { state, setDay, bookInterview, cancelInterview };
}