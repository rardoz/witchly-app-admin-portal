export interface GraphQLError {
  message: string;
  locations?: Array<{ line: number; column: number }>;
  path?: string[];
  extensions?: {
    code: string;
    stacktrace?: string[];
    http?: {
      status: number;
    };
  };
}
