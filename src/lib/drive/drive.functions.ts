import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";
import { site } from "@/lib/site";
import { listDrivePdfs, type DrivePdf } from "./drive.server";

export type { DrivePdf };

/** Public: the PDF library from the shared Google Drive notes folder (read live, so new files appear automatically). */
export const getDriveLibrary = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ files: DrivePdf[]; error: string | null }> => {
    try {
      return { files: await listDrivePdfs(site.driveFolderId), error: null };
    } catch (e) {
      console.error("drive library error", e);
      return { files: [], error: "The study material library is temporarily unavailable. Please try again shortly." };
    }
  },
);

export const driveLibraryQuery = queryOptions({
  queryKey: ["drive-library"],
  queryFn: () => getDriveLibrary(),
  staleTime: 5 * 60_000,
});
