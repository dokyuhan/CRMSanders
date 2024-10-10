import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authProvider } from "../Login/Authenticator";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Cookies from 'js-cookie'; 

interface TopbarProps {
  setIsSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const Topbar: React.FC<TopbarProps> = ({ setIsSidebar }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLogout = () => {
    console.log('Logging out...');
    authProvider.logout();
    console.log('Cookies removed:', Cookies.get('user_role'), Cookies.get('user_ID'));
    setTimeout(() => {
        navigate('/login', { replace: true });
    }, 100); // Ajusta el tiempo si es necesario
};

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="flex justify-between p-2 bg-gray-800 text-white">
      <div></div>
      <div className="flex space-x-2">
        <button className="p-1">
          <NotificationsOutlinedIcon />
        </button>
        <button className="p-1">
          <SettingsOutlinedIcon />
        </button>
        <button className="p-1" onClick={handleMenuClick}>
          <PersonOutlinedIcon />
        </button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default Topbar;
