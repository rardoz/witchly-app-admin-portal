export default (phase: string): number => {
  switch (phase) {
    case "new moon":
      return 1;
    case "waxing crescent":
      return 2;
    case "first quarter":
      return 3;
    case "waxing gibbous":
      return 4;
    case "full moon":
      return 5;
    case "waning gibbous":
      return 6;
    case "last quarter":
      return 7;
    case "waning crescent":
      return 8;
    default:
      return 0;
  }
};
