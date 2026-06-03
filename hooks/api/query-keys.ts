export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    me: () => [...queryKeys.auth.all, 'me'] as const,
  },
  tenant: {
    all: ['tenant'] as const,
    current: () => [...queryKeys.tenant.all, 'current'] as const,
  },
  students: {
    all: ['students'] as const,
    lists: () => [...queryKeys.students.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.students.lists(), filters ?? {}] as const,
    detail: (id: string) => [...queryKeys.students.all, 'detail', id] as const,
  },
} as const
