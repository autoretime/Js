async function getJson(src) {
      let response = await fetch(src);
      let json = await response.json();
      return json;  
}

async function renderUsers() {
  let arr = await getJson('https://jsonplaceholder.typicode.com/users');
  arr.forEach(obj => {
      let { name, id } = obj;
      let button = document.createElement('button');
      button.classList.add('user');
      button.dataset.userId = id;
      button.innerText = name;
      document.querySelector('.users').append(button);
  });
  hideElement('.second-wrapper')
  hideElement('.third-wrapper')
}

async function renderUserInfo(id) {
  let arr = await getJson('https://jsonplaceholder.typicode.com/users');
  arr.forEach(obj => {
      if (obj.id === id) {
          let { name, username, address: { city, street }, email, phone, website } = obj;
          let table = document.createElement('table');
          table.insertAdjacentHTML('beforeend', `
                        
                      <tr>
                          <th id="name">Name:</th>
                          <td>${name}</td>
                      </tr>
                      <tr>
                          <th id="user-name">Username:</th>
                          <td>${username}</td>
                      </tr>
                      <tr>
                          <th id="address">Address:</th>
                          <td>${city}, ${street}</td>
                      </tr>
                      <tr>
                          <th id="email">Email:</th>
                          <td>${email}</td>
                      </tr>
                      <tr>
                          <th id="phone">Phone:</th>
                          <td>${phone}</td>
                      </tr>
                      <tr>
                          <th id="website">Website:</th>
                          <td>${website}</td>
                      </tr>
                      
                      
          `);
          let Table = document.querySelector('.table');
          Table.innerHTML = '';
          Table.append(table);
          let showPostsBtn = document.querySelector('#show-posts');
          showPostsBtn.dataset.userId = id;
      }
  })
}

async function renderUserPosts(id) {
  let arr = await getJson('https://jsonplaceholder.typicode.com/posts');
  let Posts = document.querySelector('.Posts');
        Posts.innerHTML = '';
        arr.forEach(obj => {
            if (obj.userId === id) {
                let { title, body } = obj;
                let div = document.createElement('div');
                div.classList.add('posts');
                div.innerHTML = `
                <h3>${title}</h3>
                <p>${body}</p>`;
                Posts.append(div);
            }
        });
  showElement('.third-wrapper')
}
function hideElement(selector) {
  let elem = document.querySelector(selector);
  elem.classList.add('active');
}
function showElement(selector) {
  let elem = document.querySelector(selector);
  elem.classList.remove('active');
}

document.addEventListener('DOMContentLoaded', () => renderUsers());
document.querySelector('.users').addEventListener('click', (e) => {
if (e.target.className === 'user') {
  renderUserInfo(+e.target.dataset.userId);
  showElement('.second-wrapper')
  hideElement('.third-wrapper')
};
});
document.querySelector('#show-posts').addEventListener('click', (e) => renderUserPosts(+e.target.dataset.userId));