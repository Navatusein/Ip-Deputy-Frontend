import {FC} from "react";
import {Button, Card, Form, GetProps, Input, notification, Typography} from "antd";
import {IUser, userApi} from "@/entities/user";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import {FetchBaseQueryError} from "@reduxjs/toolkit/query";
import {SerializedError} from "@reduxjs/toolkit";
import {IError} from "@/entities/error";
import {useNavigate} from "react-router-dom";

const {Title} = Typography;

type CardProps = GetProps<typeof Card>

interface FormData {
  login: string;
  password: string;
}

const SignIn: FC<CardProps> = (props) => {
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();

  const [loginUser] = userApi.useLoginUserMutation();

  const signIn = async (data: FormData) => {
    const result: {data?: IUser, error?: FetchBaseQueryError | SerializedError} = await loginUser(data);

    if (result.error !== undefined) {
      const error = (result.error as FetchBaseQueryError).data as IError;

      console.error("Request error", error);

      api.error({
        message: "Login error",
        description: error?.message ?? "Unknown"
      })

      return;
    }

    navigate("/");
  }

  return (
    <Card {...props}>
      {contextHolder}
      <Title level={2} style={{textAlign: "center"}}>Ip Deputy</Title>
      <Form name="sign-in" onFinish={signIn}>
        <Form.Item name="login" rules={[{required: true, message: "Enter login"}]}>
          <Input name="login" prefix={<UserOutlined/>} placeholder="Username"/>
        </Form.Item>
        <Form.Item name="password" rules={[{required: true, message: "Enter password"}]}>
          <Input.Password name="password" prefix={<LockOutlined/>} placeholder="Password"/>
        </Form.Item>
        <Form.Item style={{marginBottom: 0}}>
          <Button block type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default SignIn;