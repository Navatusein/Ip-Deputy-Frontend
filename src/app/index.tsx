import "@/shared/styles/global/index.scss"

import ReactDOM from "react-dom/client";
import {RouterProvider} from "react-router-dom";
import {router} from "@/app/router.tsx";
import {Provider} from "react-redux";
import {store} from "@/app/store.ts";
import {App, ConfigProvider} from "antd";
import enUS from 'antd/lib/locale/en_US';
import ThemeProvider from "@/app/provider/theme-provider/theme-provider";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <ConfigProvider locale={enUS}>
      <ThemeProvider>
        <App>
          <RouterProvider router={router}/>
        </App>
      </ThemeProvider>
    </ConfigProvider>
  </Provider>
)