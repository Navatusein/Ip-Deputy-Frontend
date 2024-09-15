import {FC, useMemo} from "react";
import {useAppSelector} from "@/shared/hooks/use-app-selector.ts";
import {jwtDecoder} from "@/shared/helpers/jwt-decoder.ts";
import {Navigate, Outlet} from "react-router-dom";

const ProtectedLayout: FC = () => {

  const {user} = useAppSelector(state => state.user);

  const jwtPayload = useMemo(() => {
    if (!user)
      return undefined;

    return jwtDecoder(user.jwtToken);
  }, [user]);

  if (!user || !jwtPayload)
    return <Navigate to="/login" replace/>

  return <Outlet/>;
};

export default ProtectedLayout;