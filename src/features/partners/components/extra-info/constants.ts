import type { DayWorkingHours, PaymentMethod } from '../../types/partner.types';

export const DEFAULT_DAYS: DayWorkingHours[] = [
  { day: 'الأحد', isOpen: true, openTime: '09:00 AM', closeTime: '10:00 PM' },
  { day: 'الاثنين', isOpen: true, openTime: '09:00 AM', closeTime: '10:00 PM' },
  { day: 'الثلاثاء', isOpen: true, openTime: '09:00 AM', closeTime: '10:00 PM' },
  { day: 'الأربعاء', isOpen: true, openTime: '09:00 AM', closeTime: '10:00 PM' },
  { day: 'الخميس', isOpen: true, openTime: '09:00 AM', closeTime: '10:00 PM' },
  { day: 'الجمعة', isOpen: true, openTime: '09:00 AM', closeTime: '10:00 PM' },
  { day: 'السبت', isOpen: true, openTime: '09:00 AM', closeTime: '10:00 PM' },
];

export const PAYMENT_OPTIONS: { id: PaymentMethod; label: string }[] = [
  { id: 'cash', label: 'نقداً' },
  { id: 'visa', label: 'Visa' },
  { id: 'mastercard', label: 'MasterCard' },
  { id: 'applePay', label: 'Apple Pay' },
  { id: 'googlePay', label: 'Google Pay' },
  { id: 'cliq', label: 'CliQ' },
  { id: 'eWallets', label: 'محافظ إلكترونية' },
];

export const TIME_OPTIONS = [
  '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
  '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM',
  '08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM', '10:00 PM', '10:30 PM',
  '11:00 PM', '11:30 PM', '12:00 AM',
];

export const DEFAULT_PAYMENT_METHODS: PaymentMethod[] = ['cash', 'visa'];
export const DEFAULT_WHATSAPP = '+962 7X XXX XXXX';
export const DEFAULT_BRANCH_PHONE = '+962 6 XXX XXXX';
