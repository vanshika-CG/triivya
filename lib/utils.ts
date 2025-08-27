export const formatPrice = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount)
}

export function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ")
}
