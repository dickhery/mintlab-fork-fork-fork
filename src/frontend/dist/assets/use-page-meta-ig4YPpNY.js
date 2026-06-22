import { D as DEFAULT_SHARE_IMAGE } from "./share-urls-CbGyTrAI.js";
import { r as reactExports } from "./index-DrbJ3Dgs.js";
function upsertMeta(selector, attributes, content) {
  if (!content) return;
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    for (const [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, value);
    }
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}
function usePageMeta(meta) {
  reactExports.useEffect(() => {
    if (meta.title) {
      document.title = meta.title;
    }
    upsertMeta(
      'meta[name="description"]',
      { name: "description" },
      meta.description
    );
    upsertMeta(
      'meta[property="og:title"]',
      { property: "og:title" },
      meta.title
    );
    upsertMeta(
      'meta[property="og:description"]',
      { property: "og:description" },
      meta.description
    );
    upsertMeta(
      'meta[property="og:image"]',
      { property: "og:image" },
      meta.image ?? DEFAULT_SHARE_IMAGE
    );
    upsertMeta('meta[property="og:url"]', { property: "og:url" }, meta.url);
    upsertMeta(
      'meta[name="twitter:title"]',
      { name: "twitter:title" },
      meta.title
    );
    upsertMeta(
      'meta[name="twitter:description"]',
      { name: "twitter:description" },
      meta.description
    );
    upsertMeta(
      'meta[name="twitter:image"]',
      { name: "twitter:image" },
      meta.image ?? DEFAULT_SHARE_IMAGE
    );
  }, [meta.description, meta.image, meta.title, meta.url]);
}
export {
  usePageMeta as u
};
