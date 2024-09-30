import {FC} from "react";
import {Layout, theme} from "antd";
import {Outlet} from "react-router-dom";
import {SideMenu} from "@/widgets/side-menu";
import {Header} from "@/widgets/header";

const {Content} = Layout;

const DashboardLayout: FC = () => {
  const {token: {paddingLG}} = theme.useToken();


  return (
    <Layout>
      <SideMenu/>
      <Layout>
        <Header pageTitle={"Header"}/>
        <Layout style={{overflowY: "auto"}}>
          <Content style={{padding: `${paddingLG}px`, minHeight: "fit-content"}}>
            <Outlet/>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;