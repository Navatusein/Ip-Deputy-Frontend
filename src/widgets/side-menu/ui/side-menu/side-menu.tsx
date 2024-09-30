import {FC, useState} from "react";
import {Layout, Menu, MenuProps} from "antd";
import {Link, useLocation} from "react-router-dom";
import {BookOutlined, CheckSquareOutlined, HomeOutlined, SolutionOutlined, UserOutlined} from "@ant-design/icons";

const {Sider} = Layout;

const SideMenu: FC = () => {
  const location = useLocation();

  const [isMobileWidth, setIsMobileWidth] = useState<boolean>(false)

  const items: MenuProps["items"] = [
    {
      label: <Link to="/home">Home</Link>,
      key: "home",
      icon: <HomeOutlined/>
    },
    {
      label: "Students",
      key: "students",
      icon: <UserOutlined/>,
      children: [
        {
          label: <Link to="/students-info">Information</Link>,
          key: "students-info"
        },
        {
          label: <Link to="/subgroups-info">Subgroups</Link>,
          key: "subgroups-info"
        },
        {
          label: <Link to="/telegrams-info">Telegram Info</Link>,
          key: "telegrams-info"
        },
      ]
    },
    {
      label: "Teachers",
      key: "teachers",
      icon: <SolutionOutlined/>,
      children: [
        {
          label: <Link to="/teachers-info">Information</Link>,
          key: "teachers-info"
        },
      ]
    },
    {
      label: "Subjects",
      key: "subjects",
      icon: <BookOutlined/>,
      children: [
        {
          label: <Link to="/subjects-info">Information</Link>,
          key: "subjects-info"
        },
        {
          label: <Link to="/schedule">Schedule</Link>,
          key: "schedule"
        },
      ]
    },
    {
      label: "Submissions",
      key: "submissions",
      icon: <CheckSquareOutlined/>,
      children: [
        {
          label: <Link to="/submission-configs">Config</Link>,
          key: "submission-configs"
        },
        {
          label: <Link to="/submission-info">Information</Link>,
          key: "submission-info"
        },
      ]
    }
  ];

  console.log(location.pathname)

  return (
    <Sider
      breakpoint={"md"}
      theme="dark"
      onBreakpoint={(broken) => {setIsMobileWidth(broken)}}
      collapsible
      collapsedWidth={isMobileWidth ? "0px" : "60px"}
      style={{position: isMobileWidth ? "absolute" : undefined, zIndex: 100, top: 0, bottom: 0, left: 0}}
    >
      <Menu theme="dark" mode="inline" items={items} defaultSelectedKeys={[location.pathname.replace("/","")]}/>
    </Sider>
  );
};

export default SideMenu;