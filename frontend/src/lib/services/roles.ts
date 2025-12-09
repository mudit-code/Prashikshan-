// Role IDs mapping (should match backend seed data)
export const ROLE_IDS = {
  Student: 1,
  Company: 2,
  Admin: 3,
} as const;

export const ROLE_NAMES = {
  1: 'Student',
  2: 'Company',
  3: 'Admin',
} as const;

export const getRoleId = (roleName: string): number => {
  return ROLE_IDS[roleName as keyof typeof ROLE_IDS] || 1;
};

export const getRoleName = (roleId: number): string => {
  return ROLE_NAMES[roleId as keyof typeof ROLE_NAMES] || 'Student';
};

