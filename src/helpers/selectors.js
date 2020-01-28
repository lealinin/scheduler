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

export function getInterviewersForDay(state, day) {
  const findDay = state.days.find(element => element.name === day)
  const interviewerArr = [];

  if (!findDay) {
    return [];
  }

  const interviewers = findDay.interviewers;
  // const interviewers = findDay.appointments; // had this b/c 2 tests weren't passing
  // console.log('inerviewers ', interviewers);
  interviewers.forEach(interviewer => {
    if (state.interviewers[interviewer]) {
      interviewerArr.push(state.interviewers[interviewer]);
    }
  });

  return interviewerArr;
}

export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }

  const interviewer = state.interviewers[interview.interviewer];
  return {...interview, interviewer}
}