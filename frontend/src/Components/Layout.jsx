import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

/**
 * Layout Component - Main layout wrapper for the application
 * 
 * This component provides a consistent structure across all pages by wrapping
 * content with a navbar and optional sidebar. It handles the overall page layout
 * and responsive design.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The page content to be rendered inside the layout
 * @param {boolean} props.showSidebar - Whether to display the sidebar (default: false)
 * @returns {JSX.Element} The layout structure with navbar, sidebar, and main content area
 */
const Layout = ({ children, showSidebar = false }) => {
  return (
    // Main container with full screen height
    <div className="min-h-screen">
      {/* Flex container for sidebar and main content */}
      <div className="flex">
        {/* Conditional sidebar rendering - only shows if showSidebar is true */}
        {showSidebar && <Sidebar />}

        {/* Main content area with navbar and page content */}
        <div className="flex-1 flex flex-col">
          {/* Top navigation bar - always visible */}
          <Navbar />

          {/* Main content area where page components are rendered */}
          {/* overflow-y-auto allows scrolling if content exceeds viewport height */}
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default Layout;