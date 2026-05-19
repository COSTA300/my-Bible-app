# Security Specification - Sanctuary

## Data Invariants
1. A journal entry must belong to exactly one user.
2. A user can only read and write their own journal entries.
3. A user can only create their own profile.
4. Usernames must be strings and bounded in size.
5. Journal content must be strings and bounded in size.

## The "Dirty Dozen" Payloads

1. **Identity Theft (Write)**: Attempt to create a journal entry with a `userId` that is not the authenticated user's ID.
2. **Cross-User Snooping (Read)**: Attempt to read `users/userA/entries/entryID` as `userB`.
3. **Ghost Update**: Attempt to update a journal entry with an extra field `isVerified: true`.
4. **ID Poisoning**: Attempt to use a 1MB string as a document ID.
5. **PII Leak**: Attempt to list all users' private entries.
6. **State Shortcutting**: Attempt to inject a system `response` without the mentor's involvement (though the rules block all client side writes to `response` if I decide to make it system-only, but for now I'll allow it if I trust the client-side proxy, but better to prevent client from writing it if possible).
7. **Resource Exhaustion**: Send a 1MB string as the `content` of an entry.
8. **Owner Change**: Attempt to change the `userId` of an existing journal entry.
9. **Creation Spoofing**: Attempt to set a `createdAt` timestamp in the future.
10. **Unverified Creation**: Attempt to create a profile without being signed in.
11. **Shadow Profile**: Attempt to create a profile with keys not defined in the schema.
12. **Malicious ID Character**: Attempt to use `...` or `/` in a document ID.

## Test Runner (Logic Check)
The `firestore.rules` will be validated against these scenarios.
