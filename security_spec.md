# Security Specification — Danny Pizza

## 1. Data Invariants
1. **User Profile Ownership & PII Isolation**: A document at `/users/{userId}` can only be read, created, or updated by the authenticated user whose `request.auth.uid == userId` and whose email is verified (`request.auth.token.email_verified == true`). Cross-user reads and collection listing (`allow list`) on `/users` are strictly denied.
2. **Order Ownership & Identity Integrity**: An order at `/orders/{orderId}` must have `userId == request.auth.uid`, valid `id == orderId` matching `^[a-zA-Z0-9_\-]+$`, and valid initial state `status == 'placed'`.
3. **Immutable Audit Fields & Server Timestamps**: `uid`, `userId`, `id`, and `createdAt` cannot be modified after creation. `createdAt` and `updatedAt` must equal `request.time`.
4. **Terminal State Locking**: Once an order reaches `status == 'delivered'`, no further mutations are permitted. Valid status transitions must follow `placed -> cooking -> out_for_delivery -> delivered`.
5. **Bounded Payloads & Strict Allowlists**: Every string has explicit `.size()` upper bounds, `items` is bounded (`1..30`), `favoriteItemIds` is bounded (`<= 50`), and `keys().hasOnly(...)` / `affectedKeys().hasOnly(...)` block all undeclared shadow fields.

## 2. The "Dirty Dozen" Attack Payloads
1. **Unauthenticated Order Creation**: `auth = null`, create `/orders/ord_1` -> `PERMISSION_DENIED`.
2. **Identity Spoofing on Order**: Authenticated as `user_a`, create `/orders/ord_1` with `userId: "user_b"` -> `PERMISSION_DENIED`.
3. **Cross-User Order Read**: Authenticated as `user_a`, read `/orders/ord_owned_by_user_b` -> `PERMISSION_DENIED`.
4. **Unscoped List Query**: Authenticated as `user_a`, list `/orders` without `where("userId", "==", "user_a")` -> `PERMISSION_DENIED`.
5. **Shadow Field Injection on User**: Create `/users/user_a` with extra field `isAdmin: true` -> `PERMISSION_DENIED`.
6. **Privilege / Role Self-Escalation via Update**: Update `/users/user_a` adding `role: "admin"` -> `PERMISSION_DENIED`.
7. **State Shortcutting on Order Create**: Create `/orders/ord_1` with `status: "delivered"` instead of `"placed"` -> `PERMISSION_DENIED`.
8. **Invalid Status Regression / Terminal Mutation**: Update `/orders/ord_1` from `"delivered"` back to `"cooking"` -> `PERMISSION_DENIED`.
9. **Resource Exhaustion (1MB String Poisoning)**: Update `/users/user_a` with `savedAddress` > 250 chars -> `PERMISSION_DENIED`.
10. **ID Poisoning**: Create `/orders/bad$id!with*chars` -> `PERMISSION_DENIED`.
11. **Timestamp Tampering**: Create `/orders/ord_1` with backdated `createdAt` != `request.time` -> `PERMISSION_DENIED`.
12. **Unverified Email Spoof**: User token has `email_verified: false` attempting write -> `PERMISSION_DENIED`.
