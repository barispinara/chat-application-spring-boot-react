export const validatePassword = (password: string): string => {
  const passwordRegex = new RegExp("^(?=.*[0-9]).*$");
  if (!password) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters";
  if (!passwordRegex.test(password))
    return "Password must contain at least one digit";
  return "";
};

export const validateUsername = (username: string): string => {
  if (!username) return "Username is required.";
  if (username.length < 3) return "Username must be at least 3 characters.";
  return "";
};

export const validateFirstName = (firstName: string): string => {
  if (!firstName) return "First name is required.";
  if (firstName.length < 3) return "First name must be at least 3 characters.";
  return "";
};

export const validateLastName = (lastName: string): string => {
  if (!lastName) return "First name is required.";
  if (lastName.length < 3) return "First name must be at least 3 characters.";
  return "";
};
