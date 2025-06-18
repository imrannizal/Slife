export default class Todo {
  constructor({ id, owner, isPersonal, category, deadline, title, description, lastUpdated, timeCreated, isCompleted }) {
    this.id = id;
    this.owner = owner;
    this.isPersonal = isPersonal; // boolean
    this.category = category; // e.g. "Work" or "School"
    this.deadline = deadline ? new Date(deadline) : null;
    this.title = title;
    this.description = description;
    this.lastUpdated = new Date(lastUpdated);
    this.timeCreated = new Date(timeCreated);
    this.isCompleted = isCompleted;
  }
}