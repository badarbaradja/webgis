let currentUser = JSON.parse(localStorage.getItem('currentUser'));
if(!currentUser){
    window.location.href='index.html';
}

document.getElementById('user-name').innerText = currentUser.name;
document.getElementById('user-email').innerText = currentUser.email;
document.getElementById('edit-name').value = currentUser.name;

// Tampilkan lokasi favorit
function showFavorites(){
    let list = document.getElementById('fav-list');
    list.innerHTML='';
    currentUser.favorites.forEach((f,i)=>{
        let li = document.createElement('li');
        li.innerText=f;
        let delBtn = document.createElement('button');
        delBtn.innerText='X';
        delBtn.onclick = ()=>{
            currentUser.favorites.splice(i,1);
            saveUser();
            showFavorites();
        };
        li.appendChild(delBtn);
        list.appendChild(li);
    });
}
showFavorites();

// Tambah lokasi favorit
function addFavorite(){
    let loc = document.getElementById('fav-location').value;
    if(loc && !currentUser.favorites.includes(loc)){
        currentUser.favorites.push(loc);
        saveUser();
        showFavorites();
        document.getElementById('fav-location').value='';
    }
}

// Update profile
function updateProfile(){
    let name = document.getElementById('edit-name').value;
    if(name){
        currentUser.name = name;
        saveUser();
        document.getElementById('user-name').innerText = name;
        alert('Profile berhasil diperbarui!');
    }
}

// Toggle theme
function toggleTheme(){
    let isDark = document.getElementById('theme-toggle').checked;
    document.body.style.background = isDark?'#151520':'#ffffff';
    document.body.style.color = isDark?'#00ffff':'#151520';
    currentUser.settings.theme = isDark?'dark':'light';
    saveUser();
}

// Logout
function logout(){
    localStorage.removeItem('currentUser');
    window.location.href='../HTML/index.html';
}

// Simpan ke localStorage
function saveUser(){
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    let idx = users.findIndex(u=>u.email===currentUser.email);
    if(idx!==-1){
        users[idx] = currentUser;
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
}
