import { poppins } from "@/pages/_app";
import { AiFillCamera } from "react-icons/ai";

const Header = () => {
  return (
    <div className="flex justify-center px-[110px]">
      <div className="max-w-7xl w-full flex justify-between py-4 items-center">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row justify-between items-center mr-14">
            <AiFillCamera style={{ color: '#5F6D7E', marginRight: 5 }} size={15} />
            <div className={`font-semibold text-s text-[#5F6D7E] font-sans`}>
              Storytracker
            </div>
          </div>
          <div className={`text-xs text-[#5F6D7E] font-sans`}>
            Search
          </div>
        </div>
        
        <div className={`text-xs text-[#5F6D7E] font-sans`}>
          Updated hourly
        </div>
      </div>
    </div>
  );
};

export default Header;
