import React from "react";

import "components/Button.scss";

export default function Button(props) {
   let buttonClass = "button";

   if (props.confirm) {
      buttonClass += " button--confirm";
   }
   
   if (props.danger) {
      buttonClass += " button--danger";
   }

   return <button className={buttonClass}>{props.children}</button>;
}

// export const actionsData = {
//    onPinTask: action('onPinTask'),
//    onArchiveTask: action('onArchiveTask'),
//  };
 
//  export const Default = () => {
//    return <Task task={{ ...taskData }} {...actionsData} />;
//  };
 
//  export const Pinned = () => <Task task={{ ...taskData, state: 'TASK_PINNED' }} {...actionsData} />;
 
//  export const Archived = () => (
//    <Task task={{ ...taskData, state: 'TASK_ARCHIVED' }} {...actionsData} />
//  );
