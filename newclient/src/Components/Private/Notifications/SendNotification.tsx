import React from "react";
import ReactDOM from "react-dom";
import { NotificationInterface } from "../../../Interfaces";
import Success from "./Success";

export default function SendNotification({
  notifications,
  setNotifications,
}: {
  notifications: NotificationInterface[];
  setNotifications: React.Dispatch<
    React.SetStateAction<NotificationInterface[]>
  >;
}) {
  const removeAfter = (notification: NotificationInterface): void => {
    setNotifications(notifications.filter((notifi) => notifi !== notification));
  };

  const mapNotifications = notifications?.map((notifi) => {
    switch (notifi.type) {
      case "Success": {
        setTimeout(() => removeAfter(notifi), 5000);
        return <Success title={notifi.title} desc={notifi.desc} />;
      }
    }
  });

  return ReactDOM.createPortal(
    <div className="absolute top-0 left-0">
      <div className="flex flex-col my-3 mx-3">{mapNotifications}</div>
    </div>,
    document.getElementById("notifications") as HTMLElement
  );
}
