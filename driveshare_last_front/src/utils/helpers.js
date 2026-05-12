/**
 * Extracts a human-readable error message from various error shapes.
 * @param {unknown} error
 * @returns {string}
 */
export const getErrorMessage = (error) => {
  if (error && error.response?.data) {
    const data = error.response.data;
    if (typeof data === 'string') return data;
    if (data.message) return data.message;
    if (data.title) return data.title;
    return JSON.stringify(data);
  }
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred';
};
