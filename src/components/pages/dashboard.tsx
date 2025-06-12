// Import React hooks for state and lifecycle management.
import React, { useState, useEffect } from "react";
// Import layout components: TopNavigation for the header.
import TopNavigation from "../dashboard/layout/TopNavigation";
// Import layout components: Sidebar for the navigation panel.
import Sidebar from "../dashboard/layout/Sidebar";
// Import dashboard content components: DashboardGrid for displaying overview cards/widgets.
import DashboardGrid from "../dashboard/DashboardGrid";
// Import dashboard content components: TaskBoard for displaying tasks or a to-do list.
import TaskBoard from "../dashboard/TaskBoard";
// Import UI components: Button from the shared UI library.
import { Button } from "@/components/ui/button";
// Import icons: RefreshCw icon from lucide-react for the refresh button.
import { RefreshCw } from "lucide-react";
// Import utility function: cn for conditional class name joining from shared utils.
import { cn } from "@/lib/utils";

// Home component: Represents the main dashboard page.
const Home = () => {
  // State for managing the loading status of dashboard data.
  const [loading, setLoading] = useState(false);

  // handleRefresh: Simulates data refreshing by setting loading to true for a short period.
  const handleRefresh = () => {
    setLoading(true);
    // Simulate API call or data fetching delay, then reset loading state.
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };
  // State for managing the visibility of the sidebar (open/closed).
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      {/* Top navigation bar component; receives a callback to toggle sidebar visibility. */}
      <TopNavigation onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      {/* Main content area layout: A flex container for sidebar and main content.
          - h-[calc(100vh-64px)]: Sets height to viewport height minus top navigation height.
          - mt-16: Margin top to account for the fixed top navigation bar (64px = 16 * 4 units in Tailwind default spacing). */}
      <div className="flex h-[calc(100vh-64px)] mt-16">
        {/* Sidebar component. */}
        <Sidebar
          isOpen={sidebarOpen} // Controls whether the sidebar is currently open or closed.
          onToggle={() => setSidebarOpen(!sidebarOpen)} // Callback function to toggle sidebar visibility.
        />
        {/* Main content area that takes remaining space and allows scrolling if content overflows. */}
        <main className="flex-1 overflow-auto">
          {/* Container for the refresh button, aligned to the right. */}
          <div className="container mx-auto px-6 pt-4 pb-2 flex justify-end">
            {/* Refresh Dashboard Button */}
            <Button
              onClick={handleRefresh} // Triggers the loading simulation.
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 h-9 shadow-sm transition-colors flex items-center gap-2" // Styling for the button.
            >
              {/* Refresh icon. */}
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} // Icon animates (spins) when loading is true.
              />
              {/* Button text changes based on loading state. */}
              {loading ? "Loading..." : "Refresh Dashboard"}
            </Button>
          </div>
          {/* Main content container for dashboard widgets. */}
          <div
            className={cn(
              "container mx-auto p-6 space-y-8",
              "transition-all duration-300 ease-in-out",
            )}
          >
            {/* DashboardGrid component: Displays primary dashboard data/widgets. Passes loading state. */}
            <DashboardGrid isLoading={loading} />
            {/* TaskBoard component: Displays tasks or secondary dashboard information. Passes loading state. */}
            <TaskBoard isLoading={loading} />
          </div>
        </main>
      </div>
    </div>
  );
};

// Export the Home component to be used in routing or other parts of the application.
export default Home;
