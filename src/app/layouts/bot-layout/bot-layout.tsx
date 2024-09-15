import {FC, useContext, useEffect} from "react";
import {useTelegram} from "@/shared/hooks/use-telegram";
import {Flex, Layout, Spin} from "antd";
import {Outlet} from "react-router-dom";
import {userApi} from "@/entities/user";
import {useAppSelector} from "@/shared/hooks/use-app-selector.ts";
import {ThemeConfigContext} from "@/shared/contexts/theme-config-context/theme-config-context.ts";

const BotLayout: FC = () => {
  const {telegram} = useTelegram();

  const {setTheme, setToken} = useContext(ThemeConfigContext);

  const [loginBot] = userApi.useLoginUserForBotMutation()

  const user = useAppSelector(x => x.user.user);

  useEffect(() => {
    if (!telegram.initData)
      window.location.href = "https://youtu.be/dQw4w9WgXcQ?si=oC2V-G2_JOfIy4ju";

    setTheme(telegram.colorScheme);
    setToken({
      colorPrimary: telegram.themeParams.button_color,
      colorInfo: telegram.themeParams.button_color,
      colorTextBase: telegram.themeParams.text_color,
      colorLink: telegram.themeParams.link_color,
      colorBgLayout: telegram.themeParams.secondary_bg_color,
      colorBgContainer: telegram.themeParams.bg_color,
      colorBgElevated: telegram.themeParams.secondary_bg_color
    });

    loginBot(telegram.initData);
  }, []);

  return (
    <Layout style={{padding: "15px", overflowY: "auto"}}>
      {user ?
        <Outlet context={{telegram: telegram, user: user}}/> :
        <Flex align="center" justify="center" style={{height: "100%"}}>
          <Spin/>
        </Flex>
      }
    </Layout>
  );
};

export default BotLayout;