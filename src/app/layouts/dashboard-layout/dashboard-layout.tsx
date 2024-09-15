import {FC} from "react";
import {Layout} from "antd";
import {Outlet} from "react-router-dom";
import {SideMenu} from "@/widgets/side-menu";

const {Content} = Layout;

const DashboardLayout: FC = () => {

  // const {token: {colorBgContainer}} = theme.useToken();

  return (
    <Layout>
      <SideMenu/>
      <Layout>
        {/*<Header style={{padding: 0, background: colorBgContainer}}>*/}

        {/*</Header>*/}
        <Content style={{padding: "24px", overflowY: "auto"}}>
          <Outlet/>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;