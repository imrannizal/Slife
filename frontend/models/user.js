export default class User {
  constructor({ id, username, email, password = null, profilePicture = null }) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password; // null if Google OAuth
    this.profilePicture = profilePicture; // image file name or URL
  }
}