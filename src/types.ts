export type ApiResponse = {
  message: string;
}

export type LotoNumbersValidationResult = {
    message: string;
    isValid: boolean;
}

export type UserInfo = {
  isAuthenticated: boolean;
  user: User | null;
}

export type User = {
  name?: string;
}