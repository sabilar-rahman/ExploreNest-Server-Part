export const GENDER = {
  male: "male",
  female: "female",
} as const;

export const USER_ROLE = {
  ADMIN: "ADMIN",
  USER: "USER",
} as const;

export const UserSearchableFields = ["name", "email", "phone", "address"];

export const USER_STATUS = {
  ACTIVE: "ACTIVE",
  BLOCKED: "BLOCKED",
} as const;
