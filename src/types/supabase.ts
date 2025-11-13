export interface Database {
  public: {
    Tables: {
      operation_patterns: {
        Row: OperationPattern;
        Insert: Omit<OperationPattern, 'id' | 'created_at'>;
        Update: Partial<Omit<OperationPattern, 'id' | 'created_at'>>;
      };
    };
  };
}

export interface PasswordRules {
  length: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumber: boolean;
  requireSpecial: boolean;
  allowedSpecialChars: string;
}

export interface OperationPattern {
  id: string;
  operation_name: string;
  password_rules: PasswordRules;
  created_at: string;
}
