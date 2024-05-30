document.addEventListener('DOMContentLoaded', function() {
    // Ensure the login form exists before adding event listeners
    const loginForm = document.getElementById('loginForm');
    const closeButton = document.querySelector('.close-btn');
  
    if (loginForm) {
        loginForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            const username = document.getElementById('loginUsername').value.trim();
            const password = document.getElementById('loginPassword').value.trim(); // no encoding for plain text passwords
          
            try {
                const response = await fetch('http://localhost:3000/users');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const users = await response.json();

                console.log('Users fetched:', users);

                const user = users.find(user => user.username === username && user.password === password);
                if (user) {
                    // Save user details to localStorage
                    localStorage.setItem('currentUser', JSON.stringify({ userId: user.id, username: user.username }));
                    
                    alert('Login successful! Click OK to continue to the homepage.');
                    window.location.href = 'index.html'; 
                } else {
                    alert('Invalid username or password');
                }
            } catch (error) {
                console.error('Error fetching users:', error);
                alert('An error occurred while logging in. Please try again later.');
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
