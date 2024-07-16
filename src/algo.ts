export function RandomEmail(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let email = "";

  for (let i = 0; i < 10; i++) {
    email += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return email + "@mohammedabdelaziz.com";
}
