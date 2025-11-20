# Database Connection and Response Handling Guide

## Basic Connection Pattern

```typescript
import { getConnection } from '../config/moduloAccesoDB';

const connection = await getConnection();
// ... database operations
await connection.end();
```

## Stored Procedure Patterns

### 1. Procedures with OUT Parameters
```typescript
// Call procedure with OUT parameters
await connection.execute('CALL procedureName(?, ?, @outParam1, @outParam2)', [param1, param2]);

// Get OUT parameter values
const [result] = await connection.execute('SELECT @outParam1 as value1, @outParam2 as value2');
const { value1, value2 } = Array.isArray(result) && result[0] ? result[0] as any : { value1: null, value2: null };
```

### 2. Procedures that Return Table Results
```typescript
// Call procedure that returns a table
const [rows] = await connection.execute('CALL procedureName(?, @resultCode)', [param1]);
const [resultCode] = await connection.execute('SELECT @resultCode as codigo');

const codigo = Array.isArray(resultCode) && resultCode[0] ? (resultCode[0] as any).codigo : 500;

if (codigo === 200 && Array.isArray(rows) && rows.length > 0) {
    const data = rows[0] as any; // First row of results
    // Process data...
}
```

## Standard Response Patterns

### Success Response
```typescript
if (codigo === 200) {
    res.json({ success: true, data: result, message: 'Operation successful' });
}
```

### Error Responses
```typescript
if (codigo === 404) {
    res.status(404).json({ success: false, message: 'Resource not found' });
} else if (codigo === 409) {
    res.status(409).json({ success: false, message: 'Conflict error' });
} else {
    res.status(400).json({ success: false, message: 'Bad request' });
}
```

### Exception Handling
```typescript
try {
    // database operations
} catch (error) {
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
}
```

## Common Result Code Meanings
- `200`: Success
- `404`: Resource not found
- `409`: Conflict (duplicate entry)
- `400`: Bad request/validation error
- `500`: Internal server error