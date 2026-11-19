/**
 * Security Rules Verification Suite (Dirty Dozen Invariants)
 * Validates that DRAFT_firestore.rules / firestore.rules blocks all 12 attack vectors
 * defined in security_spec.md when executed against @firebase/rules-unit-testing.
 */

export const DIRTY_DOZEN_CASES = [
  { id: 1, name: 'Unauthenticated Order Creation', target: '/orders/ord_1', expected: 'PERMISSION_DENIED' },
  { id: 2, name: 'Identity Spoofing on Order', target: '/orders/ord_1', expected: 'PERMISSION_DENIED' },
  { id: 3, name: 'Cross-User Order Read', target: '/orders/ord_b', expected: 'PERMISSION_DENIED' },
  { id: 4, name: 'Unscoped List Query', target: '/orders', expected: 'PERMISSION_DENIED' },
  { id: 5, name: 'Shadow Field Injection on User', target: '/users/user_a', expected: 'PERMISSION_DENIED' },
  { id: 6, name: 'Privilege Self-Escalation via Update', target: '/users/user_a', expected: 'PERMISSION_DENIED' },
  { id: 7, name: 'State Shortcutting on Order Create', target: '/orders/ord_1', expected: 'PERMISSION_DENIED' },
  { id: 8, name: 'Terminal State Mutation', target: '/orders/ord_1', expected: 'PERMISSION_DENIED' },
  { id: 9, name: 'Resource Exhaustion String Poisoning', target: '/users/user_a', expected: 'PERMISSION_DENIED' },
  { id: 10, name: 'ID Poisoning', target: '/orders/bad$id', expected: 'PERMISSION_DENIED' },
  { id: 11, name: 'Timestamp Tampering', target: '/orders/ord_1', expected: 'PERMISSION_DENIED' },
  { id: 12, name: 'Unverified Email Spoof', target: '/users/user_a', expected: 'PERMISSION_DENIED' },
];
