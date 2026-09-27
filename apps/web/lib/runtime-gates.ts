const isProduction = process.env.NODE_ENV === 'production' && Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

export function assertLearningRuntimeBackendReady(): void {
  if (isProduction && process.env.MATH_RUNTIME_BACKEND !== 'postgres') {
    throw new Error('RUNTIME_BACKEND_NOT_CONFIGURED');
  }
}

export function assertAdultProjectionBackendReady(): void {
  if (isProduction && (process.env.MATH_ADULT_BACKEND !== 'postgres' || process.env.MATH_ADULT_PROJECTION_REPO !== 'supabase-rest-v1')) {
    throw new Error('ADULT_BACKEND_NOT_CONFIGURED');
  }
}

export function assertAssignmentBackendReady(): void {
  if (isProduction && (process.env.MATH_ASSIGNMENT_BACKEND !== 'postgres' || process.env.MATH_ASSIGNMENT_REPO !== 'supabase-rest-v1')) {
    throw new Error('ASSIGNMENT_BACKEND_NOT_CONFIGURED');
  }
}

export function assertContentBackendReady(): void {
  if (isProduction && process.env.MATH_CONTENT_BACKEND !== 'postgres') {
    throw new Error('CONTENT_BACKEND_NOT_CONFIGURED');
  }
}

