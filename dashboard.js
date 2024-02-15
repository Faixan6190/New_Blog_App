import {
  addDoc,
  collection,
  db,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getDownloadURL,
  ref,
  storage,
  updateDoc,
  uploadBytesResumable,
} from "./firebase.js";

const parent = document.getElementById("parent");
const exampleModal = document.getElementById("exampleModal");

const myModal = new bootstrap.Modal(document.getElementById("exampleModal"), {
  keyboard: false,
});
var editModal = new bootstrap.Modal(document.getElementById("editModal"), {
  keyboard: false,
});
const renderBlog = async () => {
  //   console.log("hello");
  const uid = localStorage.getItem("uid");
  // console.log("uid", uid);

  if (!uid) {
    location.replace("./index.html");
    return;
  }
  let blogArr = [];
  const querySnapshot = await getDocs(collection(db, "blogs"));
  querySnapshot.forEach(function (doc) {
    // console.log(doc.data());
    // console.log(doc.id);
    blogArr.push({
      title: doc.data().title,
      desc: doc.data().desc,
      uid: doc.data().uid,
      image: doc.data().image,
      blogId: doc.id,
      isPrivate: doc.data().isPrivate,
    });
  });
  // console.log("blogArr", blogArr);

  parent.innerHTML = "";

  for (var value of blogArr) {
    // renderCardUI(title, desc, image, id)

    // console.log(value.isPrivate, "BlogArr value");
    if (value.isPrivate) {
      if (value.uid === uid) {
        parent.innerHTML += renderCardUI(
          value.title,
          value.desc,
          value.image,
          value.blogId,
          value.isPrivate
        );
      }
    } else {
      parent.innerHTML += renderCardUI(
        value.title,
        value.desc,
        value.image,
        value.blogId,
        value.isPrivate
      );
    }
  }
};


window.addEventListener("load", renderBlog);

const createBlog = async () => {
  // console.log("createBlog");
  const blogImage = document.getElementById("blogImage");
  // console.log("blogImage", blogImage.files[0]);
  let imageURL;
  if (blogImage.files[0]) {
    imageURL = await imageUpload(blogImage.files[0]);
  } else {
    imageURL = "https://picsum.photos/200/300";
  }

  const title = document.getElementById("title");
  const desc = document.getElementById("desc");
  const uid = localStorage.getItem("uid");
  const privatePost = document.getElementById("privatePost").checked;

  let blogObj = {
    title: title.value,
    desc: desc.value,
    uid: uid,
    image: imageURL,
    isPrivate: privatePost,
  };

  if (!imageURL) {
    imageURL = "https://picsum.photos/200/300";
  }

  const docRef = await addDoc(collection(db, "blogs"), blogObj);

  parent.innerHTML += renderCardUI(
    title.value,
    desc.value,
    imageURL,
    docRef.id,
    privatePost
  );

  myModal.hide();
  title.value = "";
  desc.value = "";
  //   console.log(docRef, "docRef");
  //   console.log(desc, title);
};

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
      <button type="button" class="btn btn-info text-white fw-normal" data-bs-toggle="modal" data-bs-target="#editModal" onclick="editBlog(this)" id="${id}">Edit</button>
      <button class="btn btn-danger text-white fw-normal" onclick="deleteBlog(this)" id="${id}">Delete</button>
    </div>
  </div>`;
  return UI;
};

const imageUpload = (file) => {
  return new Promise((resolve, reject) => {
    // Create the file metadata
    /** @type {any} */
    const metadata = {
      contentType: "image/jpeg",
    };

    // Upload file and metadata to the object 'images/mountains.jpg'
    const storageRef = ref(storage, "images/" + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            // console.log("Upload is paused");
            break;
          case "running":
            // console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            break;
          case "storage/canceled":
            // User canceled the upload
            break;

          // ...

          case "storage/unknown":
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          resolve(downloadURL);
        });
      }
    );
  });
};

const deleteBlog = async (ele) => {
  console.log("deleteBLog", ele.id);

  let blogId = ele.id;

  await deleteDoc(doc(db, "blogs", blogId));
  window.location.reload();
};

// const handleEditBlog = async (data, id) => {
//   await updateDoc(doc(db, "blogs", id), data);
//   myModal.hide();
//   await renderBlog();
// };

const editBlog = async (ele) => {
  // console.log("editBLog");
  let blogId = ele.id;
  // console.log(blogId);

  const blogDoc = await getDoc(doc(db, "blogs", blogId));
  // console.log(blogDoc);
  const blogData = blogDoc.data();
  // console.log(blogData);
  document.getElementById("titleEdit").value = blogData.title;
  document.getElementById("descEdit").value = blogData.desc;
  document.getElementById("privatePostEdit").checked = blogData.isPrivate;

  document.getElementById("updateBtn").addEventListener(
    "click",
    async function () {
      const updateData = {
        title: document.getElementById("titleEdit").value,
        desc: document.getElementById("descEdit").value,
        isPrivate: document.getElementById("privatePostEdit").checked,
      };

      const newImageFile = document.getElementById("blogImageEdit").files[0];
      if (newImageFile) {
        updateData.image = await imageUpload(newImageFile);
        updateData.imageName = newImageFile.name;
      } else {
        updateData.image = blogData.image;
        updateData.imageName = blogData.imageName;
      }

      await updateDoc(doc(db, "blogs", blogId), updateData);

      // console.log(updateDoc);
      const existingCard = document.getElementById("blogId");
      if (existingCard) {
        existingCard.innerHTML = renderCardUI(
          updateData.title,
          updateData.desc,
          updateData.image,
          blogId,
          updateData.isPrivate
        );
      }

      editModal.hide();
      window.location.reload();
    },
    { once: true }
  );
};

const logoutFunc = () => {
  // console.log("logOut");
  localStorage.clear();
  window.location.replace("./index.html");
};

window.deleteBlog = deleteBlog;
window.logoutFunc = logoutFunc;
window.createBlog = createBlog;
window.editBlog = editBlog;
