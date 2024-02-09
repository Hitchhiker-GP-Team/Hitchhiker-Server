export interface placePostAppearance
{
  mapsid: string;
  name: string;
}

export class Place {
  private static counter: number = 0;
  private id: number;
  constructor() {
    this.id = Place.counter;
    Place.counter++;
  }
}
