/** Only explicitly branded files belong to the owner's notes collection. */
export function isHorticultureMasterNote(file: { title: string; folderPath: string[] }) {
  return /\bhorticulture[\s_-]*master\b/i.test([file.title, ...file.folderPath].join(" "));
}