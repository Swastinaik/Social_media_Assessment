import type { Metadata } from "next";
import Sidebar from "../components/SideBar"; // Adjust path as needed // Your global styles (include Tailwind here)

export const metadata: Metadata = {
  title: "My Next.js App",
  description: "With Supabase and Sidebar",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
  
        <div className="min-h-screen  overflow-auto flex">
          {/* Sidebar */}
          <div className="hidden md:flex">
          <Sidebar />
          </div>
          {/* Main Content: Flexes to fill the screen */}
          <main className="flex-1 overflow-auto p-6"> {/* ml-64 offsets the sidebar width */}
            {children}
          </main>
        </div>
   
  );
}
