const sanitizeMeta = (meta: string | string[]): string[] => {
  if (typeof meta === "string") {
    return meta.split(",").map((item) => item.trim());
  } else if (Array.isArray(meta)) {
    return meta.map((item) => item.trim());
  }
  return [];
};

export { sanitizeMeta };
