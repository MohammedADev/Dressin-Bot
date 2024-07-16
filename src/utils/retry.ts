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
