function showRegister(){
    document.getElementById('login-card').style.display='none';
    document.getElementById('register-card').style.display='flex';
}
function showLogin(){
    document.getElementById('login-card').style.display='flex';
    document.getElementById('register-card').style.display='none';
}

function registerUser(){
    let name = document.getElementById('reg-name').value;
    let email = document.getElementById('reg-email').value;
    let password = document.getElementById('reg-password').value;

    if(!name || !email || !password){
        document.getElementById('reg-msg').innerText = "Semua field wajib diisi!";
        return;
    }

    let users = JSON.parse(localStorage.getItem('users') || '[]');
    if(users.find(u=>u.email===email)){
        document.getElementById('reg-msg').innerText = "Email sudah terdaftar!";
        return;
    }

    users.push({name,email,password,favorites:[],settings:{theme:'dark'}});
    localStorage.setItem('users', JSON.stringify(users));
    document.getElementById('reg-msg').style.color='#00ffcc';
    document.getElementById('reg-msg').innerText = "Registrasi sukses! Silahkan login.";
}

function loginUser(){
    let email = document.getElementById('login-email').value;
    let password = document.getElementById('login-password').value;

    let users = JSON.parse(localStorage.getItem('users') || '[]');
    let user = users.find(u=>u.email===email && u.password===password);

    if(user){
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href='../HTML/DashboardUser.html';
    } else {
        document.getElementById('login-msg').innerText = "Email atau password salah!";
    }
}
