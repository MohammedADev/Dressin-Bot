import { ScraperConfig } from "./types";
import { join } from "path";

export const config: ScraperConfig = {
  SCREENSHOTS_DIR: join(__dirname, "..", "screenshots"),
  INITIAL_URL:
    "https://www.dressin.com/sharedpage?aicode=vtfG1yUM&app_name=app&share=copy_url",
  PRODUCT_URL:
    "https://www.dressin.com/products/solid-round-neck-knit-t-shirt-p25180",
};
