import {IJwtPayload} from "@/entities/user";
import {jwtDecode} from "jwt-decode";

interface IRawJwtPayload {
  exp: number,
  StudentId: number,
  Refresh: string
}

export const jwtDecoder = (jwtToken: string | undefined): IJwtPayload | undefined => {
  if (jwtToken === undefined)
    return undefined;

  const decodedToken = jwtDecode<IRawJwtPayload>(jwtToken);

  const jwtPayload: IJwtPayload = {
    expiration: decodedToken.exp,
    studentId: decodedToken.StudentId,
    refresh: decodedToken.Refresh == "true"
  }

  if (Object.values(jwtPayload).some(x => x === undefined))
    return undefined;

  return jwtPayload;
};