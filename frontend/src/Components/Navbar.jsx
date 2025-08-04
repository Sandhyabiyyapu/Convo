import { Link, useLocation } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, ShipWheelIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";

/**
 * Navbar Component - Top navigation bar for the application
 * 
 * This component provides the main navigation interface at the top of the page.
 * It includes user authentication status, navigation shortcuts, theme switching,
 * notifications, and logout functionality. The logo is conditionally displayed
 * only on chat pages.
 * 
 * @returns {JSX.Element} The navigation bar with user controls and navigation links
 */
const Navbar = () => {
  // Get current authenticated user data
  const { authUser } = useAuthUser();
  
  // Get current location to determine if we're on a chat page
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");

  // Get logout mutation function from custom hook
  const { logoutMutation } = useLogout();

  return (
    // Sticky navigation bar with base styling and z-index for layering
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
      {/* Container for responsive padding and centering */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Flex container for all navbar items */}
        <div className="flex items-center justify-end w-full">
          
          {/* CONDITIONAL LOGO - Only displayed on chat pages */}
          {isChatPage && (
            <div className="pl-5">
              {/* Logo link that navigates to home page */}
              <Link to="/" className="flex items-center gap-2.5">
                {/* Ship wheel icon as the logo */}
                <ShipWheelIcon className="size-9 text-primary" />
                {/* App name with gradient text effect */}
                <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary  tracking-wider">
                  Streamify
                </span>
              </Link>
            </div>
          )}

          {/* Right side navigation items */}
          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            
            {/* Notifications button - links to notifications page */}
            <Link to={"/notifications"}>
              <button className="btn btn-ghost btn-circle">
                <BellIcon className="h-6 w-6 text-base-content opacity-70" />
              </button>
            </Link>
          </div>

          {/* Theme selector dropdown for switching between themes */}
          <ThemeSelector />

          {/* User avatar - displays user's profile picture */}
          <div className="avatar">
            <div className="w-9 rounded-full">
              <img 
                src={authUser?.profilePic} 
                alt="User Avatar" 
                rel="noreferrer" 
              />
            </div>
          </div>

          {/* Logout button - triggers logout mutation when clicked */}
          <button 
            className="btn btn-ghost btn-circle" 
            onClick={logoutMutation}
          >
            <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;