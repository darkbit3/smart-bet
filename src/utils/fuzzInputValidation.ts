export const fuzzStrings = [
  "", "a", "abc", "A1!", "     ", "<script>alert(1)</script>", "../../etc/passwd", "😀😀😀", "verylongstring" + "x".repeat(1000)
];

export function fuzzValidateField(validator: (value: string) => boolean, values: string[]) {
  return values.map((value) => ({ value, valid: validator(value) }));
}

export function validatePhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 9 && /^(9|7)/.test(digits);
}

export function validatePassword(password: string): boolean {
  return password.length >= 6 && /[A-Za-z]/.test(password) && /\d/.test(password);
}