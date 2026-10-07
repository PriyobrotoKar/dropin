import { IconBrandGoogleFilled, IconCloudFilled } from "@tabler/icons-react";
import { buttonVariants } from "@dropin/ui/components/button";

export function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center space-y-4">
      <div className="flex flex-col items-center">
        <IconCloudFilled size={48} className="text-primary" />
        <h1 className="font-heading text-xl font-medium">
          Login to <span className="font-medium text-primary">Dropin</span>
        </h1>
      </div>
      <a
        className={buttonVariants({ size: "lg" })}
        href="http://localhost:8000/auth/google"
      >
        <IconBrandGoogleFilled data-icon="inline-start" /> Login with Google
      </a>
    </div>
  );
}
