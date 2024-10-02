import { useState } from "react";
import { Link } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";

interface ItemProps {
  title: string;
  to: string;
  icon: React.ReactNode;
  selected: string;
  setSelected: (title: string) => void;
}

const Item: React.FC<ItemProps> = ({ title, to, icon, selected, setSelected }) => {
  return (
    <Link to={to} onClick={() => setSelected(title)} className={`flex items-center p-2 text-gray-100 cursor-pointer hover:bg-gray-700 ${selected === title ? "bg-gray-600" : ""}`}>
      {icon}
      <span className="ml-2">{title}</span>
    </Link>
  );
};


const Sidebar: React.FC = () => {
  const [selected, setSelected] = useState<string>("Dashboard");
  const [imageIndex, setImageIndex] = useState<number>(0);
  const images = [
    "https://robohash.org/EP",
    "https://ui-avatars.com/api/?name=Eduardo+Porto"
  ];

  const handleImageClick = () => {
    setImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div className="bg-gray-800 w-64 transition-all duration-300">
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-5 p-4">
          <img src= "../../public/Logo_sanders.jpeg" alt="logo" className="w-10 h-10 rounded-md" />
          <span className="text-xl text-gray-100">SANDERS</span>
        </div>

        <div className="mb-6 text-center pt-2">
          <img
            alt="profile-user"
            className="cursor-pointer rounded-full w-24 h-24 mx-auto"
            src={images[imageIndex]}
            onClick={handleImageClick}
          />
          <h2 className="text-gray-100 font-bold text-lg mt-2">USUARIO</h2>
          <h5 className="text-green-500">DONADOR</h5>
        </div>

        <div className="flex-1 overflow-y-auto">
          <Item
            title="Dashboard"
            to="/"
            icon={<HomeOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
          />
          <span className="text-gray-300 mt-4 mb-2 ml-4 block">Donaciones</span>
          <Item
            title="Donaciones"
            to="/donate"
            icon={<PeopleOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title="Contactos"
            to="/contacts"
            icon={<ContactsOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title="Estadísticas"
            to="/stats"
            icon={<PeopleOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
          />
          <span className="text-gray-300 mt-4 mb-2 ml-4 block">Contactos</span>
          <Item
            title="Compañias"
            to="/iwachu"
            icon={<PeopleOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
