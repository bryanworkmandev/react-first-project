import { useState } from "react";
import "./order_form.scss";
import type { OrderFormProps } from "./constants/constants";
import ServiceRequestForm from "./components/service_request_form/service_request_form";
import Notifications from "./components/notifications/notifications";
import type { ServiceRequestData } from "../../services/ablyService";

function OrderForm({ role }: OrderFormProps) {
  const [loadedData, setLoadedData] = useState<ServiceRequestData | null>(null);

  const handleNotificationClick = (data: ServiceRequestData) => {
    // When a notification is clicked, load the data into the form
    setLoadedData(data);
  };

  return (
    <>
      <Notifications role={role} onNotificationClick={handleNotificationClick} />
      <ServiceRequestForm role={role} loadedData={loadedData} />
    </>
  );
}

export default OrderForm;