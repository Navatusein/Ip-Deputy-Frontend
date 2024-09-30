import {FC, ReactNode, useMemo, useState} from "react";
import {ConfigProvider, theme} from "antd";
import {ThemeConfig} from "antd/lib";
import {AliasToken} from "antd/es/theme/interface";
import {ThemeConfigContext} from "@/shared/contexts/theme-config-context/theme-config-context.ts";
import {useLocalStorage} from "@/shared/hooks/use-local-storage.ts";

const {defaultAlgorithm, darkAlgorithm} = theme;

export interface IProps {
  children: ReactNode;
}

const ThemeProvider: FC<IProps> = (props) => {
  const [theme, setTheme] = useLocalStorage<"dark" | "light">("theme","dark");
  const [token, setToken] = useState<Partial<AliasToken> | undefined>(undefined);

  const themeConfig = useMemo((): ThemeConfig => {
    return {
      algorithm: theme === "dark" ? darkAlgorithm : defaultAlgorithm,
      token: token
    }
  }, [theme, token]);

  return (
    <ThemeConfigContext.Provider value={{theme: theme, setTheme: setTheme, token: token, setToken: setToken}}>
      <ConfigProvider theme={themeConfig}>
        {props.children}
      </ConfigProvider>
    </ThemeConfigContext.Provider>
  );
};

export default ThemeProvider;