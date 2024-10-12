import RealtimeSvg from "./svgs/realtime.svg";
import QuerySVG from "./svgs/query.svg";
import NotesSVG from "./svgs/notifications.svg";
import LogoutSVG from "./svgs/logout.svg";

export default function Home() {
  return (
    <>
      <div className="flex justify-between mb-12">
        <div className="flex gap-4 items-center">
          <div className="w-8 h-8 rounded-full border-2 border-white" />
          <p className="text-white text-2xl">Diabeteasy</p>
        </div>
        <div className="flex gap-4 items-center">
          <p className="text-white text-2xl font-light">Dr. Mathew</p>
          <div className="w-8 h-8 rounded-full bg-[#0ff]" />
        </div>
      </div>

      <div className="grid grid-cols-[60px_3fr_1fr] gap-10 flex-grow mx-auto w-full max-w-[1 280px] max-h-full">
        <div className="h-full flex flex-col justify-between">
          <div className="rounded-full backdrop-blur-sm bg-white/5 h-fit">
            <div className="w-[60px] h-[60px] rounded-full flex justify-center items-center">
              <RealtimeSvg />
            </div>
            <div className="w-[60px] h-[60px] shadow-sm rounded-full flex justify-center items-center">
              <QuerySVG />
            </div>
            <div className="w-[60px] h-[60px] shadow-sm rounded-full flex justify-center items-center">
              <NotesSVG />
            </div>
          </div>
          <div className="rounded-full backdrop-blur-sm bg-white/5 h-[60px] border border-white/40 flex justify-center items-center">
          <LogoutSVG />
          </div>
        </div>
        <div className="overflow-y-scroll h-full">
          <div className="text-white text-4xl flex items-center mb-5">
            <div className="bg-red-600 mr-4 w-3 h-3 rounded-full blink" />
            Live Data
          </div>
          <div className="w-full flex backdrop-blur-sm bg-white/5 p-6 rounded-xl shadow-lg mb-10 relative">
            <div className="absolute top-0 left-0 w-full h-full border border-[#d0ffffa1] mask-gradient-2 rounded-xl" />
            <span className="text-white text-xl font-light h-[300px]"></span>
          </div>
          <div className="text-white text-3xl flex items-center mb-5 gap-2 ">
            Recent Activity
            <div className="flex-grow h-[1px] bg-white/40 rounded-r-full" />
          </div>
          <div className="grid grid-cols-[1fr_1fr_1fr] grid-rows-[auto_auto] gap-10">
            <div className="w-full h-full backdrop-blur-sm bg-white/5 p-6 rounded-xl shadow-lg relative col-span-2">
              <div className="absolute top-0 left-0 w-full h-full border border-[#d0ffffa1] mask-gradient rounded-xl" />
            </div>
            <div className="w-full h-full backdrop-blur-sm bg-white/5 p-6 rounded-xl shadow-lg relative">
              <div className="absolute top-0 left-0 w-full h-full border border-[#d0ffffa1] mask-gradient rounded-xl" />
            </div>
            <div className="w-full h-full backdrop-blur-sm bg-white/5 p-6 rounded-xl shadow-lg relative col-span-3">
              <div className="absolute top-0 left-0 w-full h-full border border-[#d0ffffa1] mask-gradient rounded-xl" />
            </div>
          </div>
          <div className="text-white text-3xl flex items-center mb-5 gap-2 ">
            Alerts
            <div className="flex-grow h-[1px] bg-white/40 rounded-r-full" />
          </div>
        </div>
        <div className="w-full h-full backdrop-blur-sm bg-white/5 p-6 rounded-xl shadow-lg relative">
          <div className="absolute top-0 left-0 w-full h-full border border-[#d0ffffa1] mask-gradient rounded-xl" />
          <span className="text-white text-xl font-light">Patients</span>
        </div>
      </div>
    </>
  );
}
