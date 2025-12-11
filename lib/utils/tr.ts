// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const trToEn = (text: any): string => {
  const trMap: { [key: string]: string } = {
    'ç': 'c', 'Ç': 'C',
    'ğ': 'g', 'Ğ': 'G',
    'ı': 'i', 'İ': 'I',
    'ö': 'o', 'Ö': 'O',
    'ş': 's', 'Ş': 'S',
    'ü': 'u', 'Ü': 'U',
  };
  
  return String(text).replace(/[çÇğĞıİöÖşŞüÜ]/g, (letter) => trMap[letter] || letter);
};
