import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider, theme } from "antd";

export const metadata = {
  title: "LaPlace",
  description: "Find the best things to explore in a place with the help of AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#679a04" />
      </head>
      <body>
        <ConfigProvider
          theme={{
            token: {
              // Seed Token
              colorPrimary: "#679a04",
              algorithm: [theme.darkAlgorithm, theme.compactAlgorithm],
              // Alias Token
              // colorBgContainer: "#f6ffed",
            },
          }}
        >
          <AntdRegistry>{children}</AntdRegistry>
        </ConfigProvider>
      </body>
    </html>
  );
}
