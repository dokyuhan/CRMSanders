import { useContext } from "react";
import InputBase from "@mui/material/InputBase"; // Mantengo InputBase de MUI para el input
import SearchIcon from "@mui/icons-material/Search";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";

interface TopbarProps {
  setIsSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const Topbar: React.FC<TopbarProps> = ({ setIsSidebar }) => {
  return (
    <div className="flex justify-between p-2 bg-gray-800 text-white">
      <div></div>
      {/*
      <div className="flex bg-gray-700 rounded-md">
        <InputBase
          className="ml-2 flex-1 bg-gray-700 text-white"
          placeholder="Search"
        />
        <button type="button" className="p-1">
          <SearchIcon />
        </button>
      </div>} 
      */}

      <div className="flex space-x-2">
        <button className="p-1">
          <NotificationsOutlinedIcon />
        </button>
        <button className="p-1">
          <SettingsOutlinedIcon />
        </button>
        <button className="p-1">
          <PersonOutlinedIcon />
        </button>
      </div>
    </div>
  );
};

export default Topbar;
