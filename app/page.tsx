import FixedSidebar from "@/components/FixedSidebar";
import MainContent from "@/components/MainContent";

export default function Home() {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background selection:bg-primary selection:text-primary-foreground">
      {/* Sidebar - Fixed on desktop, top of page on mobile */}
      <FixedSidebar />

      {/* Main Content Area - Scrollable */}
      <MainContent />
    </div>
  );
}
