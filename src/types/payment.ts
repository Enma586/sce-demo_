export interface Payment {
  id?: string;
  clientName: string;
  amount: number;
  date: string;
  method: string;
  status: string;
}