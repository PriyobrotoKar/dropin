import { FileController } from "@/features/file/api";
import { Files } from "@/features/file/components/files";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(dashboard)/home")({
  loader: async () => {
    const files = await FileController.getFiles();
    return files;
  },
  component: RouteComponent,
});

function RouteComponent() {
  const files = Route.useLoaderData();

  return (
    <div className="h-full">
      <Files data={files} />
    </div>
  );
}
