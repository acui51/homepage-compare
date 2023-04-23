import { playfair } from "@/pages/_app";
import { ArrowRightOutlined } from "@ant-design/icons";
import Link from "next/link";
import { Alert } from "antd";

export default function LandingPage() {
  return (
    <main className="flex flex-col items-center md:px-24 px-4 min-h-screen">
      <Alert
        message="UPDATE: April 23, 2023. We are no longer maintaining this project and therefore as a result, we have shut it down. Please contact me for more details: cuialix@gmail.com"
        type="error"
      />
      <div className="flex flex-col items-center mt-16">
        <p className="text-xs text-[#2E3646] mb-2">
          A NEWS COMPARISON DASHBOARD
        </p>
        <h3
          className={`text-[#2E3646] w-3.5/5 font-bold text-center text-5xl mb-4 ${playfair.className}`}
        >
          Get the real story. <br></br>Trace how coverage evolves.
        </h3>
        <p
          className={`mt-1.5 text-[#5F6D7E] w-4/5 md:w-3/5 text-center text-base mb-4 font-sans`}
        >
          A tool for discovering differences between publications in the subject
          matter, emphasis, and timeliness of various stories through homepages.
        </p>
        <Link
          className="text-white text-sm font-sans font-semibold"
          href="/app"
        >
          <button className="mt-3 p-2 rounded-md bg-[#2E3646]">
            Get Started
          </button>
        </Link>
      </div>
      <div className="mt-14 w-full flex flex-col md:flex-row">
        <div className="md:w-1/3 w-full p-5">
          <div className="h-full w-full border border-[#D1D9E2] rounded-xl p-5">
            <h3 className="font-sans font-bold text-[#5F6D7E] text-lg mb-5">
              Evaluate how a story has evolved over time.
            </h3>
            <p className="mt-2.5 text-sm text-[#5F6D7E] font-light">
              Real-time homepage screenshots are captured every hour. You can
              scroll reverse-chronologically to see how coverage of a story
              evolves.
            </p>
            <ArrowRightOutlined
              style={{
                color: "#5F6D7E",
                marginTop: "20px",
                fontSize: "14px",
              }}
            />
          </div>
        </div>
        <div className="md:w-1/3 w-full p-5">
          <div className="h-full w-full border border-[#D1D9E2] rounded-xl p-5">
            <h3 className="font-sans font-bold text-[#5F6D7E] text-lg mb-5">
              Compare how different newsrooms cover the same story.
            </h3>
            <p className="mt-2.5 text-sm text-[#5F6D7E] font-light">
              Our clustering algorithm finds varied coverage of the same news
              story. By clicking on a news clip title, you can retrieve all
              relevant reporting on the issue from different publications.
            </p>
            <ArrowRightOutlined
              style={{ color: "#5F6D7E", marginTop: "20px", fontSize: "14px" }}
            />
          </div>
        </div>
        <div className="md:w-1/3 w-full p-5">
          <div className="h-full w-full border border-[#D1D9E2] rounded-xl p-5">
            <h3 className="font-sans font-bold text-[#5F6D7E] text-lg mb-5">
              Compare density of coverage across topics for each individual
              newsroom.
            </h3>
            <p className="mt-2.5 text-sm text-[#5F6D7E] font-light">
              There are radar charts capturing entities most covered in newsroom
              coverage. By clicking on a publication&apos;s logo, you can
              explore the radar chart and its vertices.
            </p>
            <ArrowRightOutlined
              style={{ color: "#5F6D7E", marginTop: "20px", fontSize: "14px" }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
