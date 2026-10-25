# Security Specification for HireLocal

## Data Invariants
- A user public profile must match their auth UID.
- A worker profile must match their auth UID.
- A booking must involve the current user as either customer or worker.
- Messages can only be read/written by participants of a chat.
- Status changes in bookings are restricted to participants.

## The Dirty Dozen Payloads (Rejection Tests)
1. **Identity Spoofing**: Attempt to create a user profile with a different UID.
2. **Role Escalation**: Attempt to change role after creation (not explicitly blocked, but should be immutable in real app).
3. **Ghost Field**: Adding `isAdmin: true` to a user profile.
4. **Unauthorized Read**: Reading someone else's booking.
5. **Unauthorized Message**: Sending a message to a chat the user isn't part of.
6. **Poisoning ID**: Using a 2KB string as a booking ID.
7. **Invalid Type**: Sending a string for `hourlyRate`.
8. **Negative Rate**: Setting `hourlyRate` to -100.
9. **Spam Message**: Sending a 1MB text message.
10. **State Shortcut**: Customer cancelling a completed booking (business logic check).
11. **Orphaned Message**: Creating a message in a non-existent chat.
12. **PII Leak**: Accessing private email from public profile (isolated by not including email in public entity).

## Test Runner Logic
The `firestore.rules` will be verified against these scenarios using the Firebase Emulator or manual assertions.
