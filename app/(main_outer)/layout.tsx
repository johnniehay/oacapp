import type { Metadata } from "next";
import {
  ColorSchemeScript,
  // createTheme,
  // DEFAULT_THEME,
  MantineProvider,
  // mergeMantineTheme,
} from "@mantine/core";
// import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import theme from "../theme";
// import { breakpoints, colors } from "./theme";
import Head from "next/head";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });
//
// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "OAC Event App",
  description: "OAC FIRST LEGO League Event App",
};

// const theme = mergeMantineTheme(
//   DEFAULT_THEME,
//   createTheme({
//     fontFamily: geistSans.style.fontFamily,
//     fontFamilyMonospace: geistMono.style.fontFamily,
//     breakpoints,
//     colors,
//   }),
// );

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <Head>
      <ColorSchemeScript/>
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    </Head>
    <body
      // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      className={"antialiased"}
    >
    <MantineProvider theme={theme}>{children}</MantineProvider>
    </body>
    </html>
  );
}
