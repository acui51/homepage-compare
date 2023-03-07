import { Layout } from "@/components";
import Header from "@/components/Header";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Poppins, Playfair_Display } from "@next/font/google";

export const poppins = Poppins({
  subsets: ["latin"],
  weight: "400",
});

export const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: '500',
})

export const playfair_light = Playfair_Display({
  subsets: ['latin'],
  weight: '400',
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Header />
      <Component {...pageProps} />
    </Layout>
  );
}
