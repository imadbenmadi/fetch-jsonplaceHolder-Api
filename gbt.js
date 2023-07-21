let users_table = [];
let users_id = [];
let Posts_table = [];
const usersContainer = document.querySelector(".users_container");
const messagesContainer = document.querySelector(".messages_container");
var current_userId = 1;

function error_bg(err) {
  document.querySelector(".loading").style.display = "none";
  document.querySelector(".project_container").style.display = "flex";
  document.querySelector("body").style.backgroundColor = "red";
  messagesContainer.style.display = "none";
  document.querySelector(".error_message").style.display = "flex";
  document.querySelector(".err").innerHTML = err;
}

function setActiveStyle(childNumber) {
  const userMenuItems = document.querySelectorAll(".users_container > div");
  userMenuItems.forEach((item, index) => {
    item.style.backgroundColor =
      index === childNumber ? "rgb(163, 212, 255)" : "white";
  });
}

function user_requist_connection() {
  return fetch("https://jsonplaceholder.typicode.com/users")
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          "Failed to get data from the API 'Api not Exist'. Status: " +
            response.status
        );
      }
      return response.json();
    })
    .catch((error) => {
      let err =
        "Error: There was a network error while making the API request.\n" +
        error;
      error_bg(err);
      throw error;
    });
}

function Posts_requist_connection(current_userId) {
  return fetch(
    `https://jsonplaceholder.typicode.com/posts?userId=${current_userId}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          "Failed to get data from the API 'Api not Exist'. Status: " +
            response.status
        );
      }
      return response.json();
    })
    .catch((error) => {
      let err =
        "Error: There was a network error while making the API request.\n" +
        error;
      error_bg(err);
      throw error;
    });
}

function initilise_childs_users() {
  return user_requist_connection().then((users) => {
    for (r of users) {
      users_table.push(r);
      users_id.push(r.id);
    }
    for (const user of users_table) {
      const node = document.createElement("div");
      const br = document.createElement("br");

      const user_name = document.createTextNode(user.name);
      const user_email = document.createTextNode(user.email);
      node.setAttribute("data-id", user.id);
      node.appendChild(user_name);
      node.appendChild(br);
      node.appendChild(user_email);
      usersContainer.appendChild(node);
    }
    setActiveStyle(0);
    const Menu = document.querySelectorAll(".users_container > div");
    Menu.forEach((item, index) => {
      item.addEventListener("click", function () {
        if (item.getAttribute("data-id") == current_userId) {
        //   pass;
        }
        let userId = item.getAttribute("data-id");
        setActiveStyle(index);
        current_userId = userId;
        update_content(current_userId);
      });
    });
    return current_userId;
  });
}

function initilise_childs_messages() {
  initilise_childs_users().then((current_userId) => {
    document.querySelector(".loading").style.display = "none";
    document.querySelector(".project_container").style.display = "flex";
    document.querySelector("body").style.backgroundColor = "white";

    Posts_requist_connection(current_userId).then((res) => {
      for (r of res) {
        Posts_table.push(r);
      }

      for (const post of Posts_table) {
        const node = document.createElement("div");
        const hr = document.createElement("hr");

        const post_title = document.createTextNode(post.title);
        const post_body = document.createTextNode(post.body);
        node.appendChild(post_title);
        node.appendChild(hr);
        node.appendChild(post_body);
        messagesContainer.appendChild(node);
      }
    });
  });
}

function update_content(current_userId) {
  // Clear the existing messages content
  messagesContainer.innerHTML = "";

  // Get the posts for the selected user
  Posts_requist_connection(current_userId).then((res) => {
    for (const post of res) {
      const node = document.createElement("div");
      const hr = document.createElement("hr");

      const post_title = document.createTextNode(post.title);
      const post_body = document.createTextNode(post.body);
      node.appendChild(post_title);
      node.appendChild(hr);
      node.appendChild(post_body);
      messagesContainer.appendChild(node);
    }
  });
}

if (!navigator.onLine) {
  let err = "Check Your Network Connection !";
  error_bg(err);
  window.addEventListener("online", location.reload());
}
initilise_childs_messages();
