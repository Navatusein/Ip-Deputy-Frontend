import {FC, useState} from "react";
import {Layout, theme} from "antd";
import {Outlet} from "react-router-dom";
import {SideMenu} from "@/widgets/side-menu";
import {Header} from "@/widgets/header";
import {Footer} from "@/widgets/footer";

const {Content} = Layout;

const DashboardLayout: FC = () => {
  const {token: {paddingLG}} = theme.useToken();

  const [pageTitle, setPageTitle] = useState("Home")

  return (
    <Layout>
      <SideMenu/>
      <Layout>
        <Header pageTitle={pageTitle}/>
        <Layout style={{overflowY: "auto"}}>
          <Content style={{padding: `${paddingLG}px`, minHeight: "fit-content"}}>
            <Outlet context={{setPageTitle}}/>
          </Content>
          <Footer/>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;