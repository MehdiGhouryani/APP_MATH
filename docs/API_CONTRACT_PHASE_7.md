# API Contract — Phase 7

## Create Assignment

`POST /api/v1/assignments`

```json
{
  "id": "assignment_...",
  "classId": "...",
  "authorAccountId": "...",
  "learnerIds": ["...", "..."],
  "sharedObjective": "...",
  "sharedOutcome": "...",
  "stationIds": ["ST01"],
  "adaptationMode": "BOUNDED_ADAPTIVE",
  "startsAt": "2026-09-24T18:00:00.000Z",
  "dueAt": null,
  "completionRule": "STATION_PASS"
}
```

## Publish

`POST /api/v1/assignments/:assignmentId`

```json
{
  "action": "PUBLISH",
  "learnerIds": ["child-01", "child-02"]
}
```

## Recheck

`POST /api/v1/assignment-instances/:instanceId/recheck`

```json
{
  "requestedByAccountId": "teacher-01",
  "reason": "یک بار دیگر بررسی شود"
}
```

## Child Assignment View

`GET /api/v1/learning-identities/:learningIdentityId/assignments`

Returns assignment metadata plus the child-specific instance. It does not expose raw class-wide learning data.
