import * as XLSX from "xlsx";
import fs from "fs";
import path from "path";
import { KHADIRIYA_IMAGES } from "../src/data/khadiryaImages";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =========================
// FILE PATH EXCEL
// =========================
const filePath = path.resolve(__dirname, "../Wird_Khadirya.xlsx");

console.log("📂 FILE PATH USED:", filePath);

// =========================
// READ FILE
// =========================
if (!fs.existsSync(filePath)) {
  throw new Error("❌ Excel file not found: " + filePath);
}

const fileBuffer = fs.readFileSync(filePath);
const workbook = XLSX.read(fileBuffer, { type: "buffer" });

const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

// =========================
// SAFE HELPER
// =========================
function safe(val: any) {
  return val ? String(val).trim() : "";
}

function isValidNumber(val: any) {
  if (!val) return false;
  const str = String(val).trim();
  return str !== "" && !isNaN(Number(str));
}

// =========================
// FILTER DATA
// =========================
const litanies = rows
  .filter((r: any) => {
    const num =
      r["N°"] ||
      r["N° "] ||
      r["No"] ||
      r["Number"] ||
      r["ID"];

    return isValidNumber(num);
  })
  .map((r: any, index: number) => ({
    id: index + 1,

    image: KHADIRIYA_IMAGES[index % KHADIRIYA_IMAGES.length],

    arName: safe(r["AR — العربية (texte arabe intégral)"]),
    frName: safe(r["FR — Français"]),
    enName: safe(r["EN — English"]),

    arContent: safe(r["AR — العربية (texte arabe intégral)"]),
    frContent: safe(r["FR — Français"]),
    enContent: safe(r["EN — English"]),

    esContent: safe(r["ES — Español"]),
    trContent: safe(r["TR — Türkçe"]),
    faContent: safe(r["FA — فارسی"]),
    msContent: safe(r["MS — Bahasa Melayu"]),

    total: parseInt(
      String(r["Répétitions / عدد التكرار"] || "1").replace(/\D/g, "")
    ) || 1,

    transcription: "",
    audioUrl: null,
    tasbihId: 1,
    numOrder: index + 1,
  }));

// =========================
// COLORS
// =========================
const colors = [
  "from-green-600 to-green-800",
  "from-emerald-600 to-emerald-800",
  "from-lime-600 to-lime-800",
  "from-teal-600 to-teal-800",
];

// =========================
// BUILD WIRDS
// =========================
const wirdSections = litanies.map((lit, index) => ({
  id: lit.id,

  nameAr: `الورد ${lit.id}`,
  nameFr: `Wird ${lit.id}`,
  nameEn: `Wird ${lit.id}`,

  descriptionAr: lit.arContent,
  descriptionFr: lit.frContent,
  descriptionEn: lit.enContent,
  descriptionEs: lit.esContent,
  descriptionTr: lit.trContent,
  descriptionFa: lit.faContent,
  descriptionMs: lit.msContent,

  image: lit.image, // OK maintenant

  color: colors[index % colors.length],

  litanies: [lit],
}));

// =========================
// WRITE OUTPUT FILE
// =========================
const outputPath = path.resolve(
  __dirname,
  "../src/data/khadiryaWirds.ts"
);

fs.writeFileSync(
  outputPath,
  `export const khadiryaWirds = ${JSON.stringify(wirdSections, null, 2)}`
);

console.log("✅ Khadirya Excel import OK");
console.log("📦 Generated:", outputPath);