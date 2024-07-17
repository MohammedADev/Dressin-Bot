export function RandomEmail(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let email = "";

  for (let i = 0; i < 10; i++) {
    email += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return email + "@mohammedabdelaziz.com";
}

export function RandomName(): string {
  const firstNames = [
    "John",
    "Jane",
    "Michael",
    "Sarah",
    "William",
    "Emily",
    "James",
    "Hannah",
    "Robert",
    "Ashley",
    "Oliver",
    "Ava",
    "Benjamin",
    "Isabella",
    "Lucas",
    "Sophia",
    "Mason",
    "Mia",
    "Ethan",
    "Isabelle",
    "Alexander",
    "Charlotte",
    "Elijah",
    "Amelia",
    "James",
    "Harper",
    "Logan",
    "Evelyn",
    "Gabriel",
    "Abigail",
    "Noah",
    "Emily",
    "Liam",
    "Hannah",
    "Ethan",
    "Ava",
    "Mason",
    "Sophia",
    "Oliver",
    "Mia",
    "Benjamin",
    "Isabella",
    "Lucas",
    "Charlotte",
    "Alexander",
    "Amelia",
    "Gabriel",
    "Evelyn",
    "Abigail",
    "Harper",
    "Logan",
    "Noah",
    "Liam",
  ];
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  return `${firstName}`;
}
