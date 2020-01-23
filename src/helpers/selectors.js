export function getAppointmentsForDay(state, day) {
  const findDay = state.days.find(element => element.name === day)
  const appointArr = [];

  if (!findDay) {
    return [];
  }

  const appointments = findDay.appointments;
  appointments.forEach(appointment => {
    if (state.appointments[appointment]) {
      appointArr.push(state.appointments[appointment]);
    }
  });

  return appointArr;
}

export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }

  const interviewer = state.interviewers[interview.interviewer];
  return {
    ...interview,
    interviewer
  }
}