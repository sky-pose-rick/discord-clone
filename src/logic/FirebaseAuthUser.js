let user = null;

function isSignedIn() {
  return user;
}

function getUser() {
  return {
    username: user.username,
    userKey: user.userKey,
  };
}

function signIn(onSignIn) {
  user = {
    username: 'Guest',
    userKey: 'guest-key',
  };

  if (onSignIn) { onSignIn(user); }
}

function logout(onLogout) {
  user = null;

  if (onLogout) { onLogout(); }
}

export default {
  isSignedIn,
  signIn,
  logout,
  getUser,
};
