export class User {
  constructor(
    private _id: string,
    // Add other properties as needed
  ) {}
  get id(): string {
    return this._id;
  }
}
