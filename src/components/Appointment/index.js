import React from "react";

import "components/Appointment/styles.scss";

import Header from './Header';
import Show from './Show';
import Empty from './Empty';
import Form from './Form';
import Status from './Status';

import useVisualMode from "../../hooks/useVisualMode";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    return interview;
  }

  // const save = (name, interviewer) => {
  //   const interview = {
  //     student: name,
  //     interviewer
  //   }
  //   props.bookInterview(props.id, interview)
  //   transition(SHOW)    // warning: if bookInterview is async, this must wait until bookInterview is really done
  // };

  // console.log(props.interviewers);

  return (
    <article className="appointment">
      <Header time={props.time} />
      {/* {props.interview ? <Show student={props.interview.student} interviewer={props.interview.interviewer}/> : <Empty />} */}
      {mode === EMPTY && <Empty onAdd={() => { transition(CREATE) }} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
        />
      )}
      {mode === EMPTY || mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onCancel={() => back()}
          onSave={(name, interviewer) => {
            transition(SAVING);
            props.bookInterview(props.id, save(name, interviewer))
              .then(() => transition(SHOW))
          }}
        />
      )}
      {mode === SAVING && <Status message="Saving" />}
    </article>
  );
}