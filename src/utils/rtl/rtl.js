export const isRTL = (text) => {
  const rtlPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
  return rtlPattern.test(text);
};
