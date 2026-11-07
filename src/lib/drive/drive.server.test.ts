import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("Drive library availability", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("LOVABLE_API_KEY", "test-key");
    vi.stubEnv("GOOGLE_DRIVE_API_KEY", "test-drive-key");
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("keeps the last public PDF list when Drive temporarily rejects a refresh", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ files: [{
        id: "public-pdf", name: "Horticulture Master notes.pdf", mimeType: "application/pdf",
        createdTime: "2026-11-01T00:00:00Z", modifiedTime: "2026-11-01T00:00:00Z",
        permissions: [{ type: "anyone", role: "reader" }],
      }] })))
      .mockResolvedValueOnce(new Response('{"error":{"message":"Quota exceeded"}}', { status: 403 }));
    vi.stubGlobal("fetch", fetchMock);
    const { listDrivePdfs } = await import("./drive.server");
    expect((await listDrivePdfs("shared-folder")).map((f) => f.id)).toEqual(["public-pdf"]);
    vi.advanceTimersByTime(6 * 60_000);
    expect((await listDrivePdfs("shared-folder")).map((f) => f.id)).toEqual(["public-pdf"]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("reuses a recent successful list instead of requesting Drive for each visitor", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ files: [] })));
    vi.stubGlobal("fetch", fetchMock);
    const { listDrivePdfs } = await import("./drive.server");
    await listDrivePdfs("shared-folder");
    await listDrivePdfs("shared-folder");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});