import type { UserRole } from '@/types/database';

interface RoleGateProps {
  role: UserRole;
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function RoleGate({ role, allowedRoles, children, fallback }: RoleGateProps) {
  if (!allowedRoles.includes(role)) {
    return fallback ? <>{fallback}</> : null;
  }
  return <>{children}</>;
}
