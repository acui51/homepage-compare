import { poppins } from "@/pages/_app";
import { CameraFilled } from "@ant-design/icons";

const Header = () => {
  return (
    <div className="flex justify-center md:px-24 px-4">
      <div className="max-w-7xl w-full flex justify-between py-4 items-center">
        <div className="flex flex-row justify-between items-center mr-5 4md:mr-14">
          <CameraFilled
            style={{ color: "#5F6D7E", marginRight: 5, fontSize: "15px" }}
          />
          <div className={`font-semibold text-s text-[#5F6D7E] font-sans`}>
            Storytracker
          </div>
        </div>

        <div className={`text-xs text-[#5F6D7E] font-sans`}>Updated hourly</div>
      </div>
    </div>
  );
};

export default Header;
