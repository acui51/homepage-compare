import { poppins, playfair, playfair_light } from "@/pages/_app";
import { AiOutlineArrowRight } from "react-icons/ai";

export default function LandingPage() {
    return (
        <main className="flex flex-col items-center px-24 min-h-screen" >
            <div className="flex flex-col items-center mt-16">
                <p className="text-[10px] text-[#2E3646] mb-2">A NEWS COMPARISON DASHBOARD</p>
                <h3 className={`text-stone-700 text-[#2E3646] w-3.5/5 font-bold text-center text-[42px] leading-[45px] mb-4 ${playfair.className}`}>
                    Get the real story. <br></br>Trace how coverage evolves.
                </h3>
                <p className={`mt-1.5 text-stone-700 text-[#5F6D7E] w-3/5 text-center text-[15px] mb-4 font-sans`}>
                    A tool for discovering differences between publications in the subject matter, emphasis, and timeliness of various stories through homepages.
                </p>
                <button className="mt-3 p-2 rounded-md bg-[#2E3646]">
                    <p className="text-white text-[13px] font-sans font-semibold">Get Started</p>
                </button>
            </div>
            <div className="mt-14 w-full flex flex-row">
                <div className="w-1/3 h-[280px] p-5">
                    <div className="h-full w-full border border-[#D1D9E2] rounded-xl p-5">
                        <h3 className="font-sans font-bold text-[#5F6D7E] text-md mb-5">Evaluate how a story has evolved over time.</h3>
                        <p className="mt-2.5 text-xs text-[#5F6D7E] font-light">Real-time homepage screenshots are captured every hour. You can scroll reverse-chronologically to see
                            how coverage of a story evolves.</p>
                        <AiOutlineArrowRight style={{ color: '#5F6D7E', marginTop: '20px' }} size={14} />
                    </div>
                </div>
                <div className="w-1/3 h-[280px] p-5">
                    <div className="h-full w-full border border-[#D1D9E2] rounded-xl p-5">
                        <h3 className="font-sans font-bold text-[#5F6D7E] text-md mb-5">Compare how different newsrooms cover the same story.</h3>
                        <p className="mt-2.5 text-xs text-[#5F6D7E] font-light">Our clustering algorithm finds varied coverage of the same news story.
                            By clicking on a news clip title, you can retrieve all relevant reporting on the issue from different publications.</p>
                        <AiOutlineArrowRight style={{ color: '#5F6D7E', marginTop: '20px' }} size={14} />
                    </div>
                </div>
                <div className="w-1/3 h-[280px] p-5">
                    <div className="h-full w-full border border-[#D1D9E2] rounded-xl p-5">
                        <h3 className="font-sans font-bold text-[#5F6D7E] text-md mb-5">Compare density of coverage across topics for each individual newsroom.</h3>
                        <p className="mt-2.5 text-xs text-[#5F6D7E] font-light">There are radar charts capturing entities most covered in newsroom coverage. By clicking on
                            a publication&apos;s logo, you can explore the radar chart and its vertices.</p>
                        <AiOutlineArrowRight style={{ color: '#5F6D7E', marginTop: '20px' }} size={14} />
                    </div>
                </div>
            </div>
        </main>
    )
}