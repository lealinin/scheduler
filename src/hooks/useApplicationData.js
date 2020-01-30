import React, { useReducer, useEffect } from "react";
import axios from "axios";


// define action types as constants
const SET_DAY = "SET_DAY"; // sets the day
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA"; // set app data
const SET_INTERVIEW = "SET_INTERVIEW"; // update an interview for an appointment time

// call actions using constant values - ex. dispatch({ type: ADD, value: 3})
// reducer receives state and an action and can return the next state

// the reducer will return a new state object each time it handles a dispatched action

function reducer(state, action) {
  switch (action.type) {
    case SET_DAY:
      return { ...state, day: action.day }
    case SET_APPLICATION_DATA:
      return { ...state, days: action.days, appointments: action.appointments, interviewers: action.interviewers }
    case SET_INTERVIEW: {
      // console.log("state", state, action.id , action.interview)
      return { ...state, appointments: {...state.appointments, [action.id]: { ...state.appointments[action.id], interview: action.interview}}}
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

  // const setDay = day => setState(prev => ({ ...state, day })); /////////
  const setDay = day => dispatch({ type: SET_DAY, day });


  useEffect(() => {
    const daysPromise = axios.get('/api/days');
    const appointPromise = axios.get('/api/appointments');
    const interviewerPromise = axios.get('/api/interviewers');

    Promise.all([daysPromise, appointPromise, interviewerPromise]).then((all) => {
      console.log(all);
      // setState({ ...state, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }); //////////
      dispatch({ type: SET_APPLICATION_DATA, days: all[0].data, appointments: all[1].data, interviewers: all[2].data });
    });

  }, []);

  function bookInterview(id, interview) {
    // console.log("INTERVIEW", interview);

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

// Spots Remaining functionality

// When we add or remove an appointment, we will need to update
// the number of spots remaining that day

// add new action OR 
// use an existing one and change the state in two places at the same time

// the appointment id is known when an interview is confirmed or 
// canceled by the server

/* 
function updateObjectInArray(array, action) {
  return array.map((item, index) => {
    if (index !== action.index) {
      // This isn't the item we care about - keep it as-is
      return item
    }

    // Otherwise, this is the one we want - return an updated value
    return {
      ...item,
      ...action.item
    }
  })
}


*/


// function bookInterview(id, interview) {

//   const appointment = {
//     ...state.appointments[id], /////////
//     interview: { ...interview }
//   }

//   const appointments = {
//     ...state.appointments, //////////
//     [id]: appointment
//   }

//   return axios
//     .put(`/api/appointments/${id}`, { interview })
//     .then(() => {
//       setState({ ////////
//         ...state,
//         appointments
//       });
//     });
// }

// function cancelInterview(id, interview) {

//   const appointment = {
//     ...state.appointments[id], ////////
//     interview: interview && { ...interview }
//   }

//   const appointments = {
//     ...state.appointments, //////////
//     [id]: appointment
//   }

//   return axios
//     .delete(`/api/appointments/${id}`, { interview: null })
//     .then(() => {
//       setState({ /////////
//         ...state,
//         appointments
//       });
//     });
