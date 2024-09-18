import { ScraperConfig } from "./types";
import { join } from "path";

export const config: ScraperConfig = {
  SCREENSHOTS_DIR: join(__dirname, "..", "screenshots"),
  INITIAL_URL:
    "https://www.dressin.com/sharedpage?aicode=9xGeNJec&app_name=app&share=copy_url",
  PRODUCT_URL:
    "https://www.dressin.com/products/floral-printing-v-neck-flounce-short-sleeve-blouse-p13781",
};
