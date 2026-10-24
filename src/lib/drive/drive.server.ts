import { categorize, cleanTitle, type DriveSubject } from "./categorize";

const GATEWAY = "https://connector-gateway.lovable.dev/google_drive/drive/v3";
const FOLDER_MIME = "application/vnd.google-apps.folder";
const MAX_DEPTH = 4;
const MAX_FILES = 1000;

export type DrivePdf = {
  id: string;
  title: string;
  fileName: string;
  sizeBytes: number | null;
  modifiedTime: string;
  createdTime: string;
  collection: string;
  folderPath: string[];
  subjects: DriveSubject[];
};

type RawFile = {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime: string;
  createdTime: string;
  permissions?: { type: string; role: string }[];
};

async function listChildren(folderId: string, headers: HeadersInit): Promise<RawFile[]> {
  const out: RawFile[] = [];
  let pageToken: string | undefined;
  do {
    const params = new URLSearchParams({
      q: `'${folderId}' in parents and trashed=false and (mimeType='${FOLDER_MIME}' or mimeType='application/pdf')`,
      fields: "nextPageToken,files(id,name,mimeType,size,modifiedTime,createdTime,permissions(type,role))",
      pageSize: "200",
      supportsAllDrives: "true",
      includeItemsFromAllDrives: "true",
    });
    if (pageToken) params.set("pageToken", pageToken);
    const res = await fetch(`${GATEWAY}/files?${params}`, { headers });
    if (!res.ok) {
      const body = await res.text();
      console.error(`Drive list failed [${res.status}]: ${body}`);
      throw new Error(`Drive request failed (${res.status})`);
    }
    const data = (await res.json()) as { files?: RawFile[]; nextPageToken?: string };
    out.push(...(data.files ?? []));
    pageToken = data.nextPageToken;
  } while (pageToken && out.length < MAX_FILES);
  return out;
}

/**
 * Walk the shared notes folder and return every publicly viewable PDF.
 * Files not shared as "anyone with the link" are skipped so private files never leak.
 */
export async function listDrivePdfs(rootFolderId: string): Promise<DrivePdf[]> {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const driveKey = process.env["GOOGLE_DRIVE_API_KEY"];
  if (!lovableKey || !driveKey) throw new Error("Google Drive is not connected");
  const headers = { Authorization: `Bearer ${lovableKey}`, "X-Connection-Api-Key": driveKey };

  const pdfs: DrivePdf[] = [];
  let queue: { id: string; path: string[] }[] = [{ id: rootFolderId, path: [] }];

  for (let depth = 0; depth <= MAX_DEPTH && queue.length && pdfs.length < MAX_FILES; depth++) {
    const results = await Promise.all(queue.map(async (f) => ({ f, children: await listChildren(f.id, headers) })));
    const next: typeof queue = [];
    for (const { f, children } of results) {
      for (const c of children) {
        if (c.mimeType === FOLDER_MIME) {
          next.push({ id: c.id, path: [...f.path, c.name.trim()] });
          continue;
        }
        const isPublic = c.permissions?.some((p) => p.type === "anyone");
        if (!isPublic) continue;
        pdfs.push({
          id: c.id,
          title: cleanTitle(c.name),
          fileName: c.name,
          sizeBytes: c.size ? Number(c.size) : null,
          modifiedTime: c.modifiedTime,
          createdTime: c.createdTime,
          collection: f.path[0] ?? "Notes",
          folderPath: f.path,
          subjects: categorize(c.name, f.path),
        });
      }
    }
    queue = next;
  }

  return pdfs.sort((a, b) => b.createdTime.localeCompare(a.createdTime));
}
