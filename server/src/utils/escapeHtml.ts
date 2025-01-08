
import escape from 'escape-html';
// Escaping HTML helps prevent XSS attacks by sanitizing user input.

export const escapeInput = (input: any): any => {
  if (typeof input === 'string') {
    return escape(input);
  } else if (Array.isArray(input)) {
    return input.map(escapeInput);
  } else if (typeof input === 'object' && input !== null) {
    return Object.fromEntries(
      Object.entries(input).map(([key, value]) => [key, escapeInput(value)])
    );
  }
  return input;
};