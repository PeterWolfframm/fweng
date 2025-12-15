import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";

countries.registerLocale(en);

const names = countries.getNames("en", { select: "official" });
const all = Object.values(names).sort((a, b) => a.localeCompare(b));

const dach = ["Austria", "Germany", "Switzerland"];

export const countryOptions = [...dach, ...all.filter((c) => !dach.includes(c))];
