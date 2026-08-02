import path from "node:path";
import fs from "node:fs";
import { HtmlBasePlugin, I18nPlugin } from "@11ty/eleventy";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import { fileURLToPath } from "node:url";
import i18next from "i18next";
import Backend from "i18next-fs-backend";
import iso639 from "iso-639-1";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultLanguage = "is";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(HtmlBasePlugin);

  // i18n setup borrowed from https://blog.rubenwardy.com/2025/11/25/eleventy-translation/
  eleventyConfig.addPlugin(I18nPlugin, {
    defaultLanguage,
    errorMode: "allow-fallback",
  });

  // Read available locales from filesystem
  const locales = fs.readdirSync(path.join(__dirname, 'locales')).filter((fileName) => {
    const joinedPath = path.join(__dirname, 'locales', fileName);
    const isDirectory = fs.lstatSync(joinedPath).isDirectory();
    return isDirectory;
  });

  i18next.use(Backend).init({
    initAsync: false,
    lng: defaultLanguage,
    saveMissing: true,
    nsSeparator: false,
    keySeparator: false,
    fallbackLng: defaultLanguage,

    backend: {
      loadPath: path.join(__dirname, 'locales/{{lng}}/{{ns}}.json'),
      addPath: path.join(__dirname, 'locales/{{lng}}/{{ns}}.json'),
    },

    preload: locales,
  });

  // Reload i18next resources when site updates
  eleventyConfig.on("eleventy.before", () => {
    i18next.reloadResources(locales);
  });

  eleventyConfig.addFilter("i18n", function (msg, ...args) {
    const t = i18next.getFixedT(this.page.lang ?? defaultLanguage);

    if (args.length % 2 !== 0) {
      throw new Error("i18n: expected even number of arguments");
    }
    const params = {};
    for (let i = 0; i < args.length; i++) {
      const key = args[i];
      const value = args[i + 1];
      params[key] = value;
    }

    return t(msg.replaceAll("[[", "{{").replaceAll("]]", "}}"), params);
  });

  eleventyConfig.addFilter("langName", (langCode) => {
    return iso639.getNativeName(langCode.split("-")[0]);
  });

  // Generate each locale's layout files as needed
  eleventyConfig.on("eleventy.before", () => {
    fs.readdirSync(path.join(__dirname, "_includes/pages/")).forEach((f) => {
      locales.forEach((locale) => {
        const dest_filename = path.join(__dirname, locale, f);
        if (!fs.existsSync(dest_filename)) {
          fs.writeFileSync(dest_filename, `---\nlayout: pages/${f}\nlang: ${locale}\n---\n`);
        }
      });
    });
  });

  // Using gitignore breaks building the site due to it ignoring the generated locale-specific layouts
  eleventyConfig.setUseGitIgnore(false);

  // Copy the default language's index.html to root so that the bare site URL works
  eleventyConfig.on("eleventy.after", () => {
    fs.cpSync(path.join(__dirname, eleventyConfig.directories.output, defaultLanguage, "/index.html"),
              path.join(__dirname, eleventyConfig.directories.output, "/index.html"));
  });

  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    outputDir: ".cache/@11ty/img/",
    urlPath: "/img/built",
    formats: ["avif", "webp", "jpeg", "svg"],
    svgShortCircuit: true,
    transformOnRequest: false,
    
    // Maximum image widths
    widths: [4096, 2048],

    htmlOptions: {
      imgAttributes: {
        alt: "",
        loading: "lazy",
				decoding: "async",
      }
    },

    sharpJpegOptions: {
      quality: 80,
    },

    sharpWebpOptions: {
      quality: 90,
    },

    sharpAvifOptions: {
      quality: 70,
    },
  });
  
  eleventyConfig.on("eleventy.after", () => {
    fs.cpSync(".cache/@11ty/img/", path.join(__dirname, eleventyConfig.directories.output, "/img/built/"), {
      recursive: true,
    });
  });

  eleventyConfig.addPassthroughCopy("static");
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
}

export const config = {
  pathPrefix: "/Studio-Kria-Website/",
}
