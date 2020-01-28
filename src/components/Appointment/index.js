import React from "react";

import "components/Appointment/styles.scss";

import Header from './Header';
import Show from './Show';
import Empty from './Empty';
import Form from './Form';
import Status from './Status';
import Confirm from "./Confirm";
import Error from "./Error";

import useVisualMode from "../../hooks/useVisualMode";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    
    transition(SAVING);

    props
      .bookInterview(props.id, interview)
      .then(() => transition(SHOW))

  }

  console.log(props);

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
              .catch(() => transition(ERROR_DELETE, true))
          }}
          onCancel={() => transition(SHOW)}
        />
      )}
      {mode === DELETING && <Status message="Deleting" />}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onCancel={() => back()}
          onSave={save}
        />
      )}
      {mode === SAVING && <Status message="Saving" />}
      {mode === EDIT && (
        <Form
          name={props.interview.student}
          interviewers={props.interviewers}
          interviewer={props.interview.interviewer.id}
          onSave={(name, interviewer) => {
            transition(SAVING)
            props.bookInterview(props.id, save(name, interviewer))
              .then(() => transition(SHOW))
              .catch(() => transition(ERROR_SAVE, true))
          }}
          onCancel={() => transition(SHOW)}
        />
      )}
      {mode === ERROR_SAVE && (
        <Error 
        message="Could not save appointment."
        onClose={() => back()}
        />
      )}
      {mode === ERROR_DELETE && (
        <Error
        message="Could not cancel appointment."
        onClose={() => back()}
        />
      )}
    </article>
  );
}

{/* <Error
            message="Could not save appointment."
            onClose={action("onClose")}
          /> */}


{/* <Error
            message="Could not delete appointment."
            onClose={action("onClose")}
          /> */}


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