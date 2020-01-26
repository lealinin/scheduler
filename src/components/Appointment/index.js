import React from "react";

import "components/Appointment/styles.scss";

import Header from './Header';
import Show from './Show';
import Empty from './Empty';
import Form from './Form';
import Status from './Status';
import Confirm from "./Confirm";

import useVisualMode from "../../hooks/useVisualMode";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";

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

  return (
    <article className="appointment">
      <Header time={props.time} />
      {/* {props.interview ? <Show student={props.interview.student} interviewer={props.interview.interviewer}/> : <Empty />} */}
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onEdit={() => transition(EDIT)}
          onDelete={() => transition(CONFIRM)}
        />
      )}
      {mode === CONFIRM && (
        <Confirm
          message="Are you sure you would like to delete?"
          onConfirm={() => {
            transition(DELETING, true)
            props.cancelInterview(props.id)
              .then(() => transition(EMPTY))
          }}
          onCancel={() => transition(SHOW)}
        />
      )}
      {mode === DELETING && <Status message="Deleting" />}
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
      {mode === EMPTY || mode === EDIT && (
        <Form
          name={props.interview.student}
          interviewers={props.interviewers}
          interviewer={props.interview.interviewer.id}
          onSave={(name, interviewer) => {
            transition(SAVING);
            props.bookInterview(props.id, save(name, interviewer))
              .then(() => transition(SHOW))
          }}
          onCancel={() => transition(SHOW)}
        />
      )}
    </article>
  );
}


{/* <Form 
          name="Sally Greennails"
          interviewers={interviewers}
          interviewer={3}
          onSave={action("onSave")}
          onCancel={action("onCancel")}
          /> */}

{/* <Confirm
            message="Delete the appointment"
            onConfirm={action("onConfirm")}
            onCancel={action("onCancel")}
          /> */}

{/* <Show
            student="Lydia Miller-Jones"
            interviewer={interviewer}
            onEdit={action("onEdit")}
            onDelete={action("onDelete")}
          /> */}