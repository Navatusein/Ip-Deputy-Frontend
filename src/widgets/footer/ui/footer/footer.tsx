import {FC} from "react";
import {Layout, theme, Typography} from "antd";

const {Link} = Typography;

const Footer: FC = () => {
  const {token: {colorBgContainer}} = theme.useToken();

  return (
    <Layout.Footer style={{textAlign: "center", background: colorBgContainer}}>
      Ip Deputy ©{new Date().getFullYear()} Created by <Link href="https://github.com/Navatusein">Navatusein</Link>
    </Layout.Footer>
  );
};

export default Footer;