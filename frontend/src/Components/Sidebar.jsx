import { Link, useLocation } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, HomeIcon, ShipWheelIcon, UsersIcon } from "lucide-react";

/**
 * Sidebar Component - Left navigation panel for the application
 * 
 * This component provides the main navigation menu with links to different pages.
 * It includes the app logo, navigation links with active state highlighting,
 * and a user profile section at the bottom. The sidebar is hidden on mobile
 * devices and visible on desktop screens.
 * 
 * @returns {JSX.Element} The sidebar navigation with logo, links, and user profile
 */
const Sidebar = () => {
  // Get current authenticated user data
  const { authUser } = useAuthUser();
  
  // Get current location to determine active navigation link
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    // Sidebar container - hidden on mobile, visible on large screens
    <aside className="w-64 bg-base-200 border-r border-base-300 hidden lg:flex flex-col h-screen sticky top-0">
      
      {/* Header section with app logo */}
      <div className="p-5 border-b border-base-300">
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

      {/* Navigation menu with links to different pages */}
      <nav className="flex-1 p-4 space-y-1">
        
        {/* Home page link */}
        <Link
          to="/"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/" ? "btn-active" : ""
          }`}
        >
          <HomeIcon className="size-5 text-base-content opacity-70" />
          <span>Home</span>
        </Link>

        {/* Friends page link */}
        <Link
          to="/friends"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/friends" ? "btn-active" : ""
          }`}
        >
          <UsersIcon className="size-5 text-base-content opacity-70" />
          <span>Friends</span>
        </Link>

        {/* Notifications page link */}
        <Link
          to="/notifications"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/notifications" ? "btn-active" : ""
          }`}
        >
          <BellIcon className="size-5 text-base-content opacity-70" />
          <span>Notifications</span>
        </Link>
      </nav>

      {/* USER PROFILE SECTION - Fixed at bottom of sidebar */}
      <div className="p-4 border-t border-base-300 mt-auto">
        <div className="flex items-center gap-3">
          {/* User avatar */}
          <div className="avatar">
            <div className="w-10 rounded-full">
              <img src={authUser?.profilePic} alt="User Avatar" />
            </div>
          </div>
          
          {/* User information */}
          <div className="flex-1">
            {/* User's full name */}
            <p className="font-semibold text-sm">{authUser?.fullName}</p>
            {/* Online status indicator */}
            <p className="text-xs text-success flex items-center gap-1">
              <span className="size-2 rounded-full bg-success inline-block" />
              Online
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;