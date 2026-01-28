export const formatPKR = (amount) => {
  const formattedNumber = new Intl.NumberFormat('en-PK', {
    maximumFractionDigits: 0, // Set to 2 if you want .00
  }).format(amount);

  return `Rs ${formattedNumber}`;
};