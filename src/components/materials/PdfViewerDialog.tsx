import { ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { DrivePdf } from "@/lib/drive/drive.functions";

/** In-page PDF viewer using Google Drive's embeddable preview. */
export function PdfViewerDialog({ file, onClose }: { file: DrivePdf | null; onClose: () => void }) {
  return (
    <Dialog open={!!file} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="flex h-[92dvh] w-[96vw] max-w-6xl flex-col gap-3 p-3 sm:p-5">
        {file && (
          <>
            <DialogHeader className="flex-row items-start justify-between gap-3 space-y-0 pr-8 text-left">
              <div className="min-w-0">
                <DialogTitle className="truncate font-display text-xl">{file.title}</DialogTitle>
                <DialogDescription className="truncate">{file.folderPath.join(" › ") || "Notes"}</DialogDescription>
              </div>
              <Button asChild variant="soft" size="sm" className="shrink-0">
                <a href={`https://drive.google.com/file/d/${file.id}/view`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink /> Open / Download
                </a>
              </Button>
            </DialogHeader>
            <iframe
              title={file.title}
              src={`https://drive.google.com/file/d/${file.id}/preview`}
              className="min-h-0 w-full flex-1 rounded-xl border border-border bg-muted"
              allow="autoplay"
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
