import { Transactions } from "../Transactions";

interface TransactionProps {
  phoneNumber: string | null;
}

export function Transaction({ phoneNumber }: TransactionProps) {
  return (
    <Transactions phoneNumber={phoneNumber} />
  );
}
