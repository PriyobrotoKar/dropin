import { createFileRoute, Link } from "@tanstack/react-router";
import { IconCloudFilled } from "@tabler/icons-react";
import { buttonVariants } from "@dropin/ui/components/button";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center space-y-4 p-6 text-center">
      <div className="flex max-w-80 flex-col items-center gap-3">
        <IconCloudFilled size={48} className="text-primary" />
        <div className="space-y-1">
          <h1 className="font-heading text-2xl font-medium">
            Welcome to <span className="font-medium text-primary">Dropin</span>
          </h1>
          <p className="text-pretty text-muted-foreground">
            Store, share, and access your files from anywhere.
          </p>
        </div>
      </div>
      <Link to="/login" className={buttonVariants({ size: "lg" })}>
        Get started
      </Link>
    </div>
  );
}
