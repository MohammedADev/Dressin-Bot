import { Page } from "playwright";

export interface EnvironmentVariables {
  PASSWORD: string;
  FIRST_NAME: string;
  LAST_NAME: string;
  ADDRESS: string;
  PHONE: string;
}

export interface ScraperConfig {
  SCREENSHOTS_DIR: string;
  INITIAL_URL: string;
  PRODUCT_URL: string;
}

export interface PageAction {
  (page: Page, ...args: any[]): Promise<void>;
}

export interface ModalHandler {
  (page: Page): Promise<void>;
}

export interface CheckoutStep {
  (page: Page): Promise<void>;
}

export interface ProductOption {
  name: string;
  selector: string;
}

export interface ProductSelectionConfig {
  options: ProductOption[];
  addToCartSelector: string;
}

export interface RegistrationFormData {
  email: string;
  password: string;
}

export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
}
