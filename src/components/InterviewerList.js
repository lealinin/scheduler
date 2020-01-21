import React from "react";
import InterviewerListItem from './InterviewerListItem';

import "components/InterviewerList.scss";

export default function InterviewerList(props) {
  const InterviewerListItems = props.interviewers.map((interviewer) =>
    <InterviewerListItem
      key={interviewer.id}
      name={interviewer.name}
      selected={interviewer.id === props.value}
      avatar={interviewer.avatar}
      setInterviewer={() => props.onChange(interviewer.id)}
    />
  );
  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">
        {InterviewerListItems}
      </ul>
    </section>
  );
}