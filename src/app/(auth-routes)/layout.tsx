import Link from "next/link";
import { Home, BookOpenText } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid lg:grid-cols-2 min-h-screen">
      {/* Left Column - Marketing/Branding */}
      <div className="relative hidden lg:flex flex-col bg-pink-900 text-white p-10">
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold"><Home /></span>
          </Link>
          
        </div>
        <div className="mt-[200px]">
            <h1 className="text-4xl font-bold tracking-tight">
            Explore my collection of love stories and intimate guides.  
              <br />
              
            </h1>
            <p className="mt-4 text-lg text-gray-300">
            Each book is crafted to transport you to a world where passion reigns and love conquers all. 
            </p>
          </div>
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black"/>

      </div>

      {/* Right Column - Auth Forms */}
      <div className="flex items-center justify-center p-4">
        <div className="w-full max-w-sm space-y-4">
          {/* Back to Home link for mobile */}
          <div className="lg:hidden mb-8">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-normal"><Home /></span>
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
