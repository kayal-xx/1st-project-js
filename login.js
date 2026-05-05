// check alredy login user
document.addEventListener('DOMContentLoaded', () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (currentUser && currentUser.username) {
    window.location.href = 'index.html';  // Already home page irukka, antha paiya po
  }

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
});

// login handler
function handleLogin(e) {
  e.preventDefault();
  clearErrors();
  
  const emailOrUsername = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  
  // Validation
  if (!emailOrUsername) {
    showError('email', 'Email or username is required');
    return;
  }
  
  if (!password) {
    showError('password', 'Password is required');
    return;
  }
  
  // Get all users from localStorage
  let users = JSON.parse(localStorage.getItem('users')) || [];
  
  // Find user by email or username
  const user = users.find(u => 
    u.email === emailOrUsername || u.username === emailOrUsername
  );
  
  if (!user) {
    showError('email', 'User not found');
    return;
  }
  
  // Check password
  if (user.password !== password) {
    showError('password', 'Incorrect password');
    return;
  }
  
  // Login successful
  const currentUser = {
    username: user.username,
    email: user.email
  };
  
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  showSuccess('✓ Login successful! Going to home...');
  
  // Redirect to home page
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1000);
}

// sign up handler 
document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', handleSignup);
  }
});

function handleSignup(e) {
  e.preventDefault();
  clearErrors();
  
  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value.trim();
  
  // Validation
  let hasError = false;
  
  if (!username) {
    showError('username', 'Username is required');
    hasError = true;
  } else if (username.length < 3) {
    showError('username', 'Username must be at least 3 characters');
    hasError = true;
  }
  
  if (!email) {
    showError('signupEmail', 'Email is required');
    hasError = true;
  } else if (!isValidEmail(email)) {
    showError('signupEmail', 'Invalid email format');
    hasError = true;
  }
  
  if (!password) {
    showError('signupPassword', 'Password is required');
    hasError = true;
  } else if (password.length < 6) {
    showError('signupPassword', 'Password must be at least 6 characters');
    hasError = true;
  }
  
  if (hasError) return;
  
  // Get existing users
  let users = JSON.parse(localStorage.getItem('users')) || [];
  
  // Check if username or email already exists
  if (users.find(u => u.username === username)) {
    showError('username', 'Username already taken');
    return;
  }
  
  if (users.find(u => u.email === email)) {
    showError('signupEmail', 'Email already registered');
    return;
  }
  
  // Create new user
  const newUser = {
    username: username,
    email: email,
    password: password,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  
  // Auto login
  const currentUser = {
    username: newUser.username,
    email: newUser.email
  };
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  
  // Show success and redirect
  showSuccess('✓ Account created! Going to home...');
  
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1500);
}

// helper
function showError(inputId, message) {
  const input = document.getElementById(inputId);
  if (!input) return;
  
  input.classList.add('error');
  
  // Find or create error message
  let errorElement = input.parentElement.querySelector('.error-text');
  
  if (!errorElement) {
    errorElement = document.createElement('div');
    errorElement.className = 'error-text';
    input.parentElement.appendChild(errorElement);
  }
  
  errorElement.textContent = message;
  errorElement.classList.add('show');
  
  // remove error
  input.addEventListener('focus', () => {
    input.classList.remove('error');
    if (errorElement) errorElement.classList.remove('show');
  }, { once: true });
}

function showSuccess(message) {
  const form = document.querySelector('.login-form') || document.querySelector('#signupForm');
  if (!form) return;
  
  let successDiv = form.parentElement.querySelector('.success-message');
  
  if (!successDiv) {
    successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    form.parentElement.insertBefore(successDiv, form);
  }
  
  successDiv.textContent = message;
  successDiv.classList.add('show');
}

function clearErrors() {
  document.querySelectorAll('input').forEach(input => {
    input.classList.remove('error');
  });
  
  document.querySelectorAll('.error-text').forEach(el => {
    el.classList.remove('show');
  });
}

function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// logout
function logoutUser() {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
  }
}