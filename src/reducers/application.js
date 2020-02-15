export const SET_DAY = "SET_DAY";
export const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
export const SET_INTERVIEW = "SET_INTERVIEW";

export default function reducer(state, action) {
  switch (action.type) {
    case SET_DAY:
      return { ...state, day: action.day }
    case SET_APPLICATION_DATA:
      return { ...state, days: action.days, appointments: action.appointments, interviewers: action.interviewers }
    case SET_INTERVIEW: {

      let appointment = {}

      if (action.interview) {
        appointment = { ...state.appointments[action.id], interview: {...action.interview} }
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