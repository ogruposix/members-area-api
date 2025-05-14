import { SetMetadata } from "@nestjs/common";
import { Role as RoleType } from "@prisma/client";

export const ROLE_KEY = "role";
export const Role = (role: RoleType) => SetMetadata(ROLE_KEY, role);
