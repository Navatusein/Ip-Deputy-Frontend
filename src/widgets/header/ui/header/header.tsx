import {FC} from "react";
import {Button, Flex, Layout, Space, theme, Typography} from "antd";
import {logout} from "@/entities/user/model/user-slice.ts";
import {useAppDispatch, useAppSelector} from "@/shared/hooks/use-app-selector.ts";

const {Title, Text} = Typography;

interface IProps {
  pageTitle: string;
}

const Header: FC<IProps> = (props) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);

  const {token: {paddingLG, paddingSM, colorBgContainer}} = theme.useToken();

  return (
    <Layout.Header style={{padding: `0 ${paddingLG}px`, background: colorBgContainer}}>
      <Flex justify="space-between" align="center" style={{height: "100%"}}>
        <Space direction="horizontal" style={{overflow: "hidden"}}>
          <Title level={4} style={{margin: 0, textWrap: "nowrap", textOverflow: "ellipsis"}}>
            {props.pageTitle}
          </Title>
        </Space>
        <Space direction="horizontal" align="center" style={{marginLeft: `${paddingSM}px`}}>
          <Text style={{textWrap: "nowrap"}}>
            Login as {user?.userName}
          </Text>
          <Button onClick={() => dispatch(logout())}>
            Logout
          </Button>
        </Space>
      </Flex>
    </Layout.Header>
  );
};

export default Header;