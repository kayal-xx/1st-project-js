// ========== SIGNUP HANDLER ==========
document.getElementById('signupForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  // Clear previous errors
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
  showSuccess('Account created successfully! Redirecting...');
  
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1500);
});

// ========== HELPER FUNCTIONS ==========
function showError(inputId, message) {
  const input = document.getElementById(inputId);
  if (input) {
    input.classList.add('error');
    
    // Create error message if doesn't exist
    let errorElement = input.nextElementSibling;
    if (!errorElement || !errorElement.classList.contains('error-text')) {
      errorElement = document.createElement('div');
      errorElement.className = 'error-text';
      input.parentNode.insertBefore(errorElement, input.nextSibling);
    }
    
    errorElement.textContent = message;
    errorElement.classList.add('show');
  }
}

function showSuccess(message) {
  let successDiv = document.querySelector('.success-message');
  
  if (!successDiv) {
    successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    document.querySelector('.login-form').insertAdjacentElement('beforebegin', successDiv);
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

function toggleForm() {
  // This will toggle between login and signup
  // You can add login form similarly
}

// ========== CHECK IF ALREADY LOGGED IN ==========
document.addEventListener('DOMContentLoaded', () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (currentUser && currentUser.username) {
    window.location.href = 'index.html';
  }
});