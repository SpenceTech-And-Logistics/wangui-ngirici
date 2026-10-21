/*
  Starting content. Facts come from the Parliament of Kenya member page, Wikipedia and Citizen Digital.
  Anything in [square brackets] is a placeholder to replace in /admin.
  Once Firebase is connected, the dashboard takes over and this file is
  only the fallback for fields that have never been saved.
*/
import site from "../../site.config.js";

export const DEFAULT_SETTINGS = {
  name: site.name,
  title: site.title,
  role: site.role,
  aspiration: site.aspiration,
  area: site.area,
  party: "DCP",
  theme: { ...site.theme },
  intro:
    "Former Woman Representative for Kirinyaga County, businesswoman, and aspirant for Governor of Kirinyaga in 2027.",
  basedIn: "Kirinyaga County",
  focus: [],
  heroImage: "",
  wideImage: "",
  wideQuote: "I will ask for the Governor\u2019s seat in 2027, and I will not be behind anybody.",
  wideQuoteBy: "Kanjai, Ndia, 29 April 2026",
  stats: [
    { value: "2017\u201322", label: "Woman Representative, Kirinyaga" },
    { value: "2", label: "Parliamentary committees" },
    { value: "2011", label: "CEO, Ngirici and Sons Ltd" },
    { value: "BCom", label: "Gretsa University" },
  ],
  career: [
    { years: "2026 \u2013 Present", role: "Aspirant for Governor, Kirinyaga County", org: "Democracy for Citizens Party (DCP)", note: "Announced her bid for the 2027 election at Kanjai, Ndia, on 29 April 2026." },
    { years: "2023 \u2013 2026", role: "Chairperson, Board of Directors", org: "Kenya Seed Company Limited", note: "Elected chair of the board in 2023." },
    { years: "2017 \u2013 2022", role: "Woman Representative, Kirinyaga County", org: "National Assembly of Kenya", note: "Elected in August 2017. Served on the Finance and Planning and Public Investments committees, and chaired the Kenya Women Parliamentary Association (KEWOPA)." },
    { years: "2011 \u2013 Present", role: "Chief Executive Officer", org: "Ngirici and Sons Ltd", note: "" },
    { years: "2000 \u2013 Present", role: "Executive Director", org: "Joy Team Tyres and Half Moon Investments", note: "" },
    { years: "1999 \u2013 2000", role: "Sales Manager", org: "Tokyo, Japan", note: "" },
  ],
  education: [
    { years: "2017 \u2013 Present", what: "MSc Human Resource", where: "Jomo Kenyatta University of Agriculture and Technology" },
    { years: "2014 \u2013 2016", what: "Bachelor of Commerce", where: "Gretsa University" },
    { years: "2012 \u2013 2013", what: "Higher Diploma in Business Management", where: "Regional Institute of Business Management" },
    { years: "2011 \u2013 2012", what: "Diploma in Business Management", where: "Regional Institute of Business Management" },
  ],
  committees: [
    "Departmental Committee on Finance and Planning (Member, 12th Parliament)",
    "Public Investments Committee (Member, 12th Parliament)",
    "Kenya Women Parliamentary Association (Chairperson, from 2017)",
  ],
  affiliations: [],
  careerIntro: "From business to the National Assembly, and now a bid to lead Kirinyaga County.",
  visionIntro: "",
  pillars: [],
  pledge: "",
  contact: { address: "", phone: "", email: "", hours: "" },
  socials: {
    facebook: "https://www.facebook.com/WanguiNgirici/",
    x: "https://x.com/WanguiNgirici",
    instagram: "",
    youtube: "",
    tiktok: "",
    linkedin: "",
    threads: "",
    whatsapp: "",
  },
  links: [],
};

export const CATEGORIES = ["Women and youth", "Business and jobs", "Education", "Health", "Water and roads", "Legislation", "Community", "Other"];
export const PRESS_KINDS = ["Article", "Interview", "Video", "Statement", "Hansard"];
export const ALBUMS = ["Community", "Projects", "Parliament", "Events"];

export const SAMPLE_PROJECTS = [
  ["Women and youth", "[Project name]", "[Ward]", "[Year]", "[00%]", "[Measured outcome]"],
  ["Business and jobs", "[Project name]", "[Ward]", "[Year]", "[0,000]", "[Measured outcome]"],
  ["Education", "[Project name]", "[Ward]", "[Year]", "[00]", "[Measured outcome]"],
  ["Legislation", "[Bill or motion title]", "National Assembly", "[Year]", "[Status]", "[Where it stands]"],
].map(([category, title, place, year, result, resultLabel], i) => ({
  id: `sample-project-${i}`, category, title, place, year, result, resultLabel, order: i, image: "", url: "",
  summary: "[One line on the problem and what changed.]",
}));

export const SAMPLE_PRESS = ["Article", "Interview", "Video"].map((kind, i) => ({
  id: `sample-press-${i}`, kind, title: "[Headline or title]", outlet: "[Outlet]", date: "", url: "", image: "",
  summary: "[One line on what the piece covers.]",
}));

export const SAMPLE_GALLERY = Array.from({ length: 8 }, (_, i) => ({
  id: `sample-gallery-${i}`, image: "", caption: "[Event] · [Place]", category: ALBUMS[i % ALBUMS.length], order: i,
}));
