import {FC, ReactNode} from "react";
import {Layout} from "antd";
import {Outlet} from "react-router-dom";

export interface IProps {
  children?: ReactNode;
}

const BaseLayout: FC<IProps> = (props) => {
  return (
    <Layout style={{height: "100svh", overflow: "hidden"}}>
      {props.children ?? <Outlet/>}
    </Layout>
  );
};

export default BaseLayout;