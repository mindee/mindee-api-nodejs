import path from "node:path";

export const RESOURCE_PATH = path.join(__dirname, "data");

export const V1_RESOURCE_PATH = path.join(RESOURCE_PATH, "v1");
export const V1_PRODUCT_PATH = path.join(V1_RESOURCE_PATH, "products");

export const V2_RESOURCE_PATH = path.join(RESOURCE_PATH, "v2");
export const V2_PRODUCT_PATH = path.join(V2_RESOURCE_PATH, "products");
