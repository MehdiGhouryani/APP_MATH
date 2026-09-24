# Revision Notes — Phase 14

1. Added migrations 0039/0040 for skill-aware Recovery/Re-check and staging package v1.2.0.
2. Added mobile recovery/recheck resolver based on Decision target skill.
3. E12 no longer reports Station Pass.
4. Readiness verifier now checks the executable seed migration and intentionally blocks on provisional/educational/live verification gates.
5. Updated production runtime gates so a configured `postgres` env var cannot falsely authorize an in-memory Adult/Assignment backend.
6. Updated Phase 12 verifier for the v2 idempotency key and 0036 hardening.
