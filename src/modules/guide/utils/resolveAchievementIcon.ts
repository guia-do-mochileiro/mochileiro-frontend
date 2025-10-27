
const iconModules = import.meta.glob<string>(
  "/src/modules/guide/assets/achievements/*.png",
  { eager: true, as: "url" }
);

function norm(s: string) {
  return s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/\.(png|jpg|jpeg|webp)$/i, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}


export function resolveAchievementIcon(name: string, fallbackUrl: string) {
  const target = norm(name);
  for (const [path, url] of Object.entries(iconModules)) {
    const filename = path.split("/").pop() || "";
    if (norm(filename) === target) return url as string;
  }
  return fallbackUrl;
}
