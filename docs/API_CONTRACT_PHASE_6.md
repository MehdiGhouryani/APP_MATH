# Phase 6 API Contract

## Session

`POST /api/v1/learning/sessions`

```json
{
  "learningIdentityId": "dev-child-001",
  "relationshipContextId": "platform",
  "gradeId": "G1",
  "curriculumVersionId": "G1-CV1",
  "skillGraphVersionId": "G1-SG1",
  "sessionType": "LEARNING"
}
```

## Encounter

`POST /api/v1/learning/sessions/:sessionId/encounters`

The mobile client supplies only encounter context from the active package. The server validates version integrity before creation.

## Attempt

`POST /api/v1/learning/attempts/submit`

The request carries an idempotency key. The server evaluates the answer and returns:

- evaluation result;
- evidence reference;
- learning state;
- decision step;
- station pass;
- semantic animation event.

The client must not infer authoritative learning state from the local UI outcome.
