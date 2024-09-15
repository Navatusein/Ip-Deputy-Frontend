import {FC, useMemo} from "react";
import {isRouteErrorResponse, useRouteError} from "react-router-dom";
import {Flex, Result} from "antd";

const ErrorPage: FC = () => {
  const error = useRouteError();

  const result = useMemo(() => {
    console.log(error);

    if (isRouteErrorResponse(error)) {
      switch (error.status) {
        case 404:
          return <Result status="404" title={"404 Not found"} subTitle={error.data}/>
      }
    }

    return <Result status="error" title="Unknown error" subTitle="Something unhandled went wrong"/>
  }, [error]);

  return (
    <Flex align={"center"} justify={"center"} vertical style={{height: "100%"}}>
      {result}
    </Flex>
  );
};

export default ErrorPage;