export async function retry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 5000
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);
      if (attempt === maxRetries) {
        throw error; // Rethrow the error if we've exhausted all retries
      }
      console.log(`Retrying in ${delay / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error("This should never be reached");
}

export async function infiniteScrape(
  scrapeFunction: () => Promise<void>,
  maxRetries: number = 3,
  retryDelay: number = 10000,
  iterationDelay: number = 60000
) {
  while (true) {
    try {
      console.log("Starting new scraping iteration...");
      await retry(() => scrapeFunction(), maxRetries, retryDelay);
      console.log("Scraping iteration completed successfully");
    } catch (error) {
      console.error("Scraping iteration failed after all retries:", error);
    }
    console.log(
      `Waiting for ${iterationDelay / 1000} seconds before next iteration...`
    );
    await new Promise((resolve) => setTimeout(resolve, iterationDelay));
  }
}
