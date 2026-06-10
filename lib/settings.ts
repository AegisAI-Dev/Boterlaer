import { readFileSync } from "fs";
import { join } from "path";

const SETTINGS_FILE = join(process.cwd(), "data", "settings.json");

export function getSettings() {
  try {
    const fileContent = readFileSync(SETTINGS_FILE, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    // Return default settings if file doesn't exist
    return {
      site: {
        name: "Botanische Tuin Den Boterlaer",
        description: "Een privé hobbyproject waarin ik mijn passie voor planten deel via dit online platform.",
        tagline: "Privé Hobbytuin",
      },
      contact: {
        address: {
          name: "Botanische Tuin Den Boterlaer",
          street: "Boterlaar baan",
          city: "Deurne",
          country: "België",
        },
        email: "info@botanischetuin.nl",
        phone: "+123 456 7890",
        note: "Privétuin - niet vrij toegankelijk",
      },
      social: {
        facebook: "https://facebook.com",
        instagram: "https://instagram.com",
        twitter: "",
        youtube: "",
      },
      seo: {
        keywords: ["botanische tuin", "planten", "hobbytuin", "plantencollectie", "tuinieren"],
        author: "Den Boterlaer",
      },
    };
  }
}
