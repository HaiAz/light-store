import { Prisma } from '@prisma/client';

function calculateTotal(price: number, quantity: number = 1, taxPercentage: number | undefined) {
  return quantity * price * (taxPercentage ? (1 + taxPercentage / 100) : 1);
}

function calculateTax(price: number, quantity: number, taxPercentage: number | undefined) {
  return price * quantity * (taxPercentage ? (taxPercentage / 100) : 0 );
}

function toNumber(dNumber: Prisma.Decimal) {
  const jNumber = new Prisma.Decimal(dNumber);

  return jNumber.toNumber();
}

function calculateOutstandingBalance(total:number, discount:number, paid:number) {
  return total - (discount + paid);
}

export {
  calculateTotal,
  calculateTax,
  toNumber,
  calculateOutstandingBalance,
};
