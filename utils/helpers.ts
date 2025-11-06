import { customAlphabet } from "nanoid/non-secure";

export function formatCurrency(amount: number, dec: number = 0) {
	return "₦" + Number(amount)
		.toFixed(dec)
		.replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0";
}

export function formatShortCurrency(amount: number): string {
	if (amount >= 1_000_000) {
		return `₦${(amount / 1_000_000).toFixed(1)}M`;
	}
	if (amount >= 1_000) {
		return `₦${(amount / 1_000).toFixed(0)}k`;
	}
	return `₦${amount}`;
}

export function formatNumber(amount: number) {
	return amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0";
}

export function generateSlug(num=10) {
  const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', num);
  return nanoid();
};

export function calculatePercentage(current: number, target: number, decimals: number = 0): number {
	if (target === 0) return 0;
	const percentage = (current / target) * 100;
	return Number(percentage.toFixed(decimals));
}