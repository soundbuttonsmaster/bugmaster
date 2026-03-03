import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
      <p className="text-xl mt-4 text-muted-foreground">Page not found</p>
      <Link to="/">
        <Button className="mt-6">Go Home</Button>
      </Link>
    </div>
  );
}
