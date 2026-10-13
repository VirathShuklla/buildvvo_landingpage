import { useEffect } from "react";

const setMeta = (selector, attr, value, create) => {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement(create.tag);
    Object.entries(create.attrs).forEach(([k, v]) => el.setAttribute(k, v));
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
};

export function usePageMeta(title, description) {
  useEffect(() => {
    const full = title.includes("BuildVVO") ? title : `${title} | BuildVVO Technologies`;
    document.title = full;
    setMeta('meta[name="description"]', "content", description, { tag: "meta", attrs: { name: "description" } });
    setMeta('meta[property="og:title"]', "content", full, { tag: "meta", attrs: { property: "og:title" } });
    setMeta('meta[property="og:description"]', "content", description, { tag: "meta", attrs: { property: "og:description" } });
    setMeta('link[rel="canonical"]', "href", window.location.origin + window.location.pathname, { tag: "link", attrs: { rel: "canonical" } });
  }, [title, description]);
}
