import {
  collection,
  db,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "./firebase.js";

const parent = document.getElementById("parent");

window.addEventListener("load", async () => {
  const uid = localStorage.getItem("uid");
  // console.log("uid", uid);

  if (!uid) {
    location.replace("./index.html");
    return;
  } else {
    let q = query(collection(db, "blogs"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    let myBlogArr = [];
    querySnapshot.forEach(function (doc) {
      // console.log(doc.data());
      let data = doc.data();
      myBlogArr.push({
        title: data.title,
        desc: data.desc,
        uid: data.uid,
        image: data.image,
        blogId: doc.id,
        isPrivate: data.isPrivate,
      });
    });
    // console.log("myBlogArr", myBlogArr);
    if (myBlogArr.length > 0) {
      for (let value of myBlogArr) {
        parent.innerHTML += renderCardUI(
          value.title,
          value.desc,
          value.image,
          value.blogId,
          value.isPrivate
        );
      }
    } else {
      parent.innerHTML = `<h1 class="text-white fw-semibold ">No Blog Found</h1>`;
    }
  }
});

const renderCardUI = (title, desc, image, id, isPrivate) => {
  let lockValue = "";
  if (isPrivate) {
    lockValue = `<i class="fa-solid fa-lock"></i>`;
  } else {
    lockValue = "";
  }

  let UI = `<div class="card border-0" style="width: 18rem">
    <img
      src=${image}
      class="card-img-top cus-image"
      alt="..."
    />
    <div class="card-body">
      <h5 class="card-title">${title} ${lockValue}</h5>
      <p class="card-text">
        ${desc}
      </p>
      <button class="btn btn-info" onclick="editBlog(this)" id="${id}">Edit</button>
    <button class="btn btn-danger" onclick="deleteBlog(this)" id="${id}">Delete</button>
    </div>
  </div>`;
  return UI;
};

const deleteBlog = async (ele) => {
  // console.log("deleteBLog", ele.id);
  let blogId = ele.id;

  await deleteDoc(doc(db, "blogs", blogId));
};

const editBlog = (ele) => {
  // console.log("editBlog");
  // let blogId = ele.id;
  var oldValue = ele.parentNode.previousElementSibling.innerHTML;
  console.log(oldValue, "oldValue");
};

const logoutFunc = () => {
  // console.log("logOut");
  localStorage.clear();
  window.location.replace("./index.html");
};

window.editBlog = editBlog;
window.deleteBlog = deleteBlog;
window.logoutFunc = logoutFunc;
