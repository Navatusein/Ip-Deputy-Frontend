import {FC} from "react";
import {Card} from "antd";
import {useSetPageTitle} from "@/shared/hooks/use-set-page-title.ts";

const HomePage: FC = () => {
  useSetPageTitle("Home page");

  return (
    <Card bordered={false}>
      Home page
    </Card>
  );
};

export default HomePage;