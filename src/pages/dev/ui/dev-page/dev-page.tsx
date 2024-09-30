import {FC} from "react";
import {Card} from "antd";
import {useSetPageTitle} from "@/shared/hooks/use-set-page-title.ts";

const DevPage: FC = () => {
  useSetPageTitle("Developer page");

  return (
    <Card bordered={false}>
      Dev Page
    </Card>
  );
};

export default DevPage;