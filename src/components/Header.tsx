import { poppins } from "@/pages/_app";

const Header = () => {
  return (
    <div className="bg-[#1677ff] flex justify-center px-24 drop-shadow">
      <div className="max-w-7xl w-full flex justify-between py-4 items-center">
        <div className={`font-bold text-2xl text-white ${poppins.className}`}>
          Storytracker
        </div>
        <div className={`text-white text-sm ${poppins.className}`}>
          Updated hourly
        </div>
      </div>
    </div>
  );
};

export default Header;
