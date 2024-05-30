document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const closeButton = document.querySelector('.close-btn');
  
    if (registerForm) {
        registerForm.addEventListener('submit', async function(event) {
            event.preventDefault();
  
            const username = document.getElementById('registerUsername').value.trim();
            const email = document.getElementById('registerEmail').value.trim();
            const password = document.getElementById('registerPassword').value.trim(); // storing in hashed form removed
  
            if (!username || !email || !password) {
              window.alert('All fields are required. Please fill in all fields.');
              return;
            }
  
            console.log('Register form submitted');
            console.log('Username:', username);
            console.log('Email:', email);
            console.log('Password:', password);
  
            try {
                const response = await fetch('http://localhost:3000/users');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const users = await response.json();
  
                console.log('Users fetched:', users);
  
                if (users.some(user => user.username === username) || users.some(user => user.email === email)) {
                    alert('Either Username or email already exists. Please choose a different username or email.');
                } else {
                    const newUser = { username, email, password };
                    console.log('New user to register:', newUser);
  
                    const addUserResponse = await fetch('http://localhost:3000/users', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(newUser)
                    });
  
                    if (!addUserResponse.ok) {
                        throw new Error(`HTTP error! Status: ${addUserResponse.status}`);
                    }
  
                    const addUserResult = await addUserResponse.json();
                    console.log('Add user response:', addUserResult);
  
                    console.log('New user registered:', newUser);
  
                    // alert('Registration successful! Redirecting to login page.');
                    console.log('Redirecting to login.html');
                    window.location.href = 'login.html';
                }
            } catch (error) {
                console.error('Error registering user:', error);
                alert('An error occurred while registering. Please try again later.');
            }
        });
    }
  
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            console.log('X button clicked');
            window.location.href = 'index.html';
        });
    }
  });
  