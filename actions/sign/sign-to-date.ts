export default (
  sign: string,
): { signDateStart: number; signDateEnd: number } => {
  switch (sign) {
    case "aries":
      return {
        signDateStart: 321,
        signDateEnd: 419,
      };
    case "taurus":
      return {
        signDateStart: 420,
        signDateEnd: 520,
      };
    case "gemini":
      return {
        signDateStart: 521,
        signDateEnd: 620,
      };
    case "cancer":
      return {
        signDateStart: 621,
        signDateEnd: 722,
      };
    case "leo":
      return {
        signDateStart: 723,
        signDateEnd: 822,
      };
    case "virgo":
      return {
        signDateStart: 823,
        signDateEnd: 922,
      };
    case "libra":
      return {
        signDateStart: 923,
        signDateEnd: 1022,
      };
    case "scorpio":
      return {
        signDateStart: 1023,
        signDateEnd: 1121,
      };
    case "sagittarius":
      return {
        signDateStart: 1122,
        signDateEnd: 1221,
      };
    case "capricorn":
      return {
        signDateStart: 1222,
        signDateEnd: 119,
      };
    case "aquarius":
      return {
        signDateStart: 120,
        signDateEnd: 218,
      };
    case "pisces":
      return {
        signDateStart: 219,
        signDateEnd: 320,
      };
    default:
      return {
        signDateStart: 0,
        signDateEnd: 0,
      };
  }
};
