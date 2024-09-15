import {createContext} from "react";
import {AliasToken} from "antd/es/theme/interface";

export interface IThemeConfigContextProps {
  theme: "dark" | "light";
  setTheme: (theme: "dark" | "light") => void;
  token?: Partial<AliasToken>;
  setToken: (tokens?: Partial<AliasToken>) => void;
}

export const ThemeConfigContext = createContext<IThemeConfigContextProps>({
  theme: "dark",
  setTheme: () => {},
  setToken: () => {}
});