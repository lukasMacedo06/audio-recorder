import { format } from 'date-fns';

export const formatPrice = (value: number, currency?: string | 'BRL') => {
  const auxValue = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
  }).format(value);
  return auxValue;
};

export const formatDate = (date: string, dateForm: string) => {
  const dateFormatted = format(new Date(Date.parse(date)), dateForm);
  return dateFormatted;
};
