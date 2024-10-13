import "./globals.css";
import { Raleway } from "next/font/google";

const font = Raleway({ subsets: ["latin"], weight: ["300", "500", "700"] });

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={font.className + " max-h-[100vh] h-full"}>
      <body className="p-8 px-16 max-h-[100vh] h-full flex flex-col relative overflow-hidden">
        {children}
        <div className="z-[-100] absolute top-0 left-0 w-full h-full asd">
          <div className=" w-[200px] h-[200px] ml-auto mr-[0%] mt-[5%] blur-[140px] bg-[#00ffff] rounded-full" />
          <div className=" w-[300px] h-[300px] ml-[-10%] mb-[5%] blur-[200px] bg-[#00ffff82] rounded-full" />
        </div>
      </body>
    </html>
  );
}
