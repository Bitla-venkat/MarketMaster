    document.getElementById('loginForm').addEventListener('submit', async function (e) {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (res.ok) {
        alert('Login successful!');
        console.log(data.token);
        console.log('redirecting..')
        window.location.href='/dashboard'
      } else {
        alert(data.message);
      }
    });