import { Chip } from "@mui/material";
import type { Role } from "../../types";

const roleColorMap: Record<Role, "primary" | "secondary" | "default"> = {
  student: "primary",
  teacher: "secondary",
  admin: "default",
};

interface RoleBadgeProps {
  role: Role;
}

const RoleBadge = ({ role }: RoleBadgeProps) => <Chip label={role.toUpperCase()} color={roleColorMap[role]} variant="outlined" />;

export default RoleBadge;
