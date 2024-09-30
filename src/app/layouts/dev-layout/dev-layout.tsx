import {FC} from "react";
import {Navigate, Outlet, useOutletContext} from "react-router-dom";

const IS_DEV_ENVIRONMENT = import.meta.env.VITE_ENVIRONMENT === "Development";

const DevLayout: FC = () => {
  const context = useOutletContext();

  if (!IS_DEV_ENVIRONMENT)
    return <Navigate to="/" replace/>

  return <Outlet context={context}/>;
};

export default DevLayout;