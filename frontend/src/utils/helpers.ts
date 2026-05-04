import { AxiosError } from 'axios';

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError && error.response?.data) {
    // Backend might send { message: "..." } or just a plain string
    const data = error.response.data;
    if (typeof data === 'string') return data;
    if (data.message) return data.message;
    if (data.title) return data.title;  // .NET sometimes uses "title"
    return JSON.stringify(data);
  }
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred';
};