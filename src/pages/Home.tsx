import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bug } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-blue-50 flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        <Bug className="w-20 h-20 mx-auto mb-6 text-primary" />
        <h1 className="text-4xl font-bold mb-4">Team Bug</h1>
        <p className="text-muted-foreground mb-8">
          Bug reporting software for your team. Submit, track, and resolve bugs efficiently.
        </p>
        <Link to="/signin">
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            Sign In
          </Button>
        </Link>
      </div>
    </div>
  );
}
