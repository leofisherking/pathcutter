import { Link } from "react-router";
import { Home, AlertCircle } from "lucide-react";
import { Button } from "../components/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="text-center space-y-8 max-w-md">
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="bg-red-500 p-4 rounded-lg">
            <AlertCircle className="h-16 w-16 text-white" />
          </div>
        </div>

        {/* 404 Text */}
        <h1
          className="text-5xl md:text-6xl tracking-tight"
          style={{ fontFamily: "'Press Start 2P', cursive" }}
        >
          404
        </h1>

        {/* Error Message */}
        <p
          className="text-xs text-gray-400"
          style={{ fontFamily: "'Press Start 2P', cursive" }}
        >
          Page not found
        </p>

        <p
          className="text-[10px] text-gray-500 leading-relaxed"
          style={{ fontFamily: "'Press Start 2P', cursive" }}
        >
          The link you followed may be broken or the page has been removed.
        </p>

        {/* Back to Home Button */}
        <Button
          asChild
          className="bg-white text-black hover:bg-gray-200"
          style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '8px' }}
        >
          <Link to="/">
            <Home className="h-4 w-4 mr-2" />
            Back Home
          </Link>
        </Button>
      </div>
    </div>
  );
}