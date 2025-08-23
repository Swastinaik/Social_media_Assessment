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
  
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <Sidebar />
          
          {/* Main Content: Flexes to fill the screen */}
          <main className="flex-1 overflow-y-auto p-6 ml-64"> {/* ml-64 offsets the sidebar width */}
            {children}
          </main>
        </div>
   
  );
}
