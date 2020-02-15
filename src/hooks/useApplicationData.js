import { useReducer, useEffect } from "react";
import axios from "axios";
import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW
} from "../reducers/application";

export default function useApplicationData() {

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