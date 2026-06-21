// TODO: Replace with real NextAuth session lookup when auth is set up.
// For dev/testing: set DEMO_USER_ID in .env.local to a valid User.id from the DB.
export async function getCurrentUserId(): Promise<string | null> {
  return process.env.DEMO_USER_ID ?? null
}
