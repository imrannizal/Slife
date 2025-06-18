export default class Note {
  constructor({ id, owner, title, content, color, lastUpdated, timeCreated, starred = false }) {
    this.id = id;
    this.owner = owner;
    this.title = title;
    this.content = content;
    this.color = color;
    this.lastUpdated = new Date(lastUpdated);
    this.timeCreated = new Date(timeCreated);
    this.starred = starred;
  }
}