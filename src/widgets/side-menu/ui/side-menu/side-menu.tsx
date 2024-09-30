import {FC, useState} from "react";
import {Layout, Menu, MenuProps} from "antd";
import {Link} from "react-router-dom";
import {BookOutlined, CheckSquareOutlined, SolutionOutlined, UserOutlined} from "@ant-design/icons";

const {Sider} = Layout;

const SideMenu: FC = () => {
  const [isMobileWidth, setIsMobileWidth] = useState<boolean>(false)

  const items: MenuProps["items"] = [
    {
      label: "Students",
      key: "students",
      icon: <UserOutlined/>,
      children: [
        {
          label: <Link to="/students-info">Information</Link>,
          key: "students:1"
        },
        {
          label: <Link to="/subgroups-info">Subgroups</Link>,
          key: "students:2"
        },
        {
          label: <Link to="/telegrams-info">Telegram Info</Link>,
          key: "students:3"
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
          key: "teachers:1"
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
          key: "subjects:1"
        },
        {
          label: <Link to="/schedule">Schedule</Link>,
          key: "subjects:2"
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
          key: "submissions:1"
        },
        {
          label: <Link to="/submission-info">Information</Link>,
          key: "submissions:2"
        },
      ]
    }
  ];

  return (
    <Sider
      breakpoint={"md"}
      theme="dark"
      onBreakpoint={(broken) => {setIsMobileWidth(broken)}}
      collapsible
      collapsedWidth={isMobileWidth ? "0px" : "60px"}
      style={{position: isMobileWidth ? "absolute" : undefined, zIndex: 100, top: 0, bottom: 0, left: 0}}
    >
      <Menu theme="dark" mode="inline" items={items}/>
    </Sider>
  );
};

export default SideMenu;