import { demoCredentials, users as seedUsers } from "../../../data/mockData";
import type { Role, User } from "../../../types";
import { loadFromStorage, saveToStorage } from "../../../utils/storage";
import { adminService } from "../../admin/services/adminService";

type Credential = { email: string; password: string; role: Role };

const AUTH_KEY = "nhu-auth-user";
const CREDENTIALS_KEY = "nhu-credentials";

const resolveUserByEmail = (email: string): User | undefined => {
  const adminUsers = adminService.getUsers();
  return adminUsers.find((user) => user.email === email) ?? seedUsers.find((user) => user.email === email);
};

const getStoredCredentials = (): Credential[] => loadFromStorage<Credential[]>(CREDENTIALS_KEY, []);

const getCredentialMap = (): Record<string, { password: string; role: Role }> => {
  const stored = getStoredCredentials();
  return [...demoCredentials, ...stored].reduce(
    (acc, credential) => ({
      ...acc,
      [credential.email]: { password: credential.password, role: credential.role.toLowerCase() as Role },
    }),
    {},
  );
};

const upsertCredential = (credential: Credential) => {
  const current = getStoredCredentials();
  const filtered = current.filter((item) => item.email !== credential.email);
  saveToStorage(CREDENTIALS_KEY, [...filtered, credential]);
};

export const authService = {
  authenticate: (email: string, password: string): User => {
    const credentialMap = getCredentialMap();
    const credential = credentialMap[email];
    if (!credential || credential.password !== password) {
      throw new Error("Invalid email or password");
    }

    const user = resolveUserByEmail(email);
    if (!user) {
      throw new Error("Account not found. Please request access from admin.");
    }
    if (user.status === "inactive") {
      throw new Error("Account is inactive. Contact admin.");
    }

    saveToStorage(AUTH_KEY, user);
    return user;
  },
  getStoredUser: (): User | undefined => loadFromStorage<User | undefined>(AUTH_KEY, undefined),
  clearStoredUser: () => saveToStorage<User | undefined>(AUTH_KEY, undefined),
  saveCredential: (email: string, password: string, role: Role) => upsertCredential({ email, password, role }),
  getCredentials: (): Credential[] => getStoredCredentials(),
};
