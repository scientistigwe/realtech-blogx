// validations.js

// Username Validation
export function validateUsername(username) {
  const re = /^[\w.@+-]{3,150}$/;
  return re.test(username);
}

// Email Validation
export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Password Validation
export function validatePassword(password) {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/;
  const hasLowerCase = /[a-z]/;
  const hasNumber = /[0-9]/;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
  return (
    password.length >= minLength &&
    hasUpperCase.test(password) &&
    hasLowerCase.test(password) &&
    hasNumber.test(password) &&
    hasSpecialChar.test(password)
  );
}

// Password Confirmation
export function validatePasswordConfirmation(password, confirmPassword) {
  return password === confirmPassword;
}

// Title Validation
export function validatePostTitle(title) {
  const minLength = 5;
  const maxLength = 100;
  return title.length >= minLength && title.length <= maxLength;
}

// Content Validation
export function validatePostContent(content) {
  const minLength = 50;
  return content.length >= minLength;
}

// Slug Validation
export function validateSlug(slug) {
  const re = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return re.test(slug);
}

// Comment Content Validation
export function validateCommentContent(content) {
  const minLength = 5;
  return content.length >= minLength;
}

// Category/Tag Name Validation
export function validateCategoryName(name) {
  const minLength = 3;
  const maxLength = 50;
  return name.length >= minLength && name.length <= maxLength;
}

// Contact Message Validation
export function validateContactMessage(name, email, message) {
  return (
    name.trim().length > 0 && validateEmail(email) && message.trim().length > 0
  );
}

// URL Validation
export function validateUrl(url) {
  const re = /^(https?:\/\/[^\s/$.?#].[^\s]*)$/i;
  return re.test(url);
}
