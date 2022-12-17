import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import FirebaseApp from './FirebaseApp';

let auth = getAuth(FirebaseApp.app);
let user = auth.currentUser;

async function getUserAuth() {
  auth = getAuth(FirebaseApp.app);
  await auth.operations;
  user = auth.currentUser;
  return auth.currentUser;
}

async function isSignedIn() {
  if (!user) {
    user = getUserAuth();
  }
  // console.log('request status auth', auth);
  // console.log('request status user', user);
  return user;
}

async function registerUser(userDetails, onSignIn) {
  const { email, password } = userDetails;
  // create user in authentication
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  user = userCredential.user;
  await updateProfile(user, { displayName: userDetails.username });

  if (onSignIn) { onSignIn({ uid: user.uid, displayName: userDetails.username }); }
}

function signInUser(email, password, onSignIn) {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      console.log('user signed in', email);
      user = userCredential.user;
      if (onSignIn) { onSignIn(user); }
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode, errorMessage);
    });

  if (onSignIn) { onSignIn(user); }
}

function logoutUser(onLogout) {
  signOut(auth).then(() => {
    const lastUser = user;
    user = null;
    if (onLogout) { onLogout(lastUser); }
  }).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error(errorCode, errorMessage);
  });
}

export default {
  isSignedIn,
  signInUser,
  registerUser,
  logoutUser,
  getUserAuth,
};
