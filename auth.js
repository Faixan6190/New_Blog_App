import {
  auth,
  createUserWithEmailAndPassword,
  db,
  doc,
  getDoc,
  setDoc,
  signInWithEmailAndPassword,
} from "./firebase.js";

const signUp = () => {
  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");
  const email = document.getElementById("email");
  const number = document.getElementById("number");
  const password = document.getElementById("password");

  // console.log(email.value, password.value);
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then(async (success) => {
      console.log(success);

      const userObj = {
        user_id: success.user.uid,
        email: email.value,
        firstName: firstName.value,
        lastName: lastName.value,
        number: number.value,
      };

      await setDoc(doc(db, "users", success.user.uid), userObj);

      alert("Successfully SignUp");
      location.href = "./index.html";
    })
    .catch((error) => {
      console.log(error);
      alert(error);
    });
};

const loginFunc = () => {
  const email = document.getElementById("email");
  const password = document.getElementById("password");

  signInWithEmailAndPassword(auth, email.value, password.value)
    .then(async (success) => {
      // console.log(success);
      //  userData;
      const docRef = doc(db, "users", success.user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        localStorage.setItem("uid", success.user.uid);
        localStorage.setItem("userData", JSON.stringify(docSnap.data()));
        alert("Succesfully Login");
        window.location.href = "./dashboard.html";
      } else {
        // docSnap.data() will be undefined in this case
        alert("Something Wrong");
        console.log("No such document!");
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

window.addEventListener("load", () => {
  //   console.log("hello");
  const uid = localStorage.getItem("uid");
  // console.log("uid", uid);

  if (uid) {
    location.replace("./dashboard.html");
    return;
  }
});

window.signUp = signUp;
window.loginFunc = loginFunc;
