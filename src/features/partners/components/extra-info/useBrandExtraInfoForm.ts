import { useState } from 'react';
import type { BrandExtraInfo, DayWorkingHours, PaymentMethod } from '../../types/partner.types';
import {
  DEFAULT_DAYS,
  DEFAULT_PAYMENT_METHODS,
  DEFAULT_WHATSAPP,
  DEFAULT_BRANCH_PHONE,
} from './constants';

interface UseBrandExtraInfoFormArgs {
  initialData?: BrandExtraInfo;
  onSave?: (data: BrandExtraInfo) => void;
  onCancel?: () => void;
}

export const useBrandExtraInfoForm = ({
  initialData,
  onSave,
  onCancel,
}: UseBrandExtraInfoFormArgs) => {
  const [workingHours, setWorkingHours] = useState<DayWorkingHours[]>(
    initialData?.workingHours && initialData.workingHours.length > 0
      ? initialData.workingHours
      : DEFAULT_DAYS
  );
  const [deliveryEnabled, setDeliveryEnabled] = useState<boolean>(
    initialData?.deliveryEnabled ?? true
  );
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(
    initialData?.paymentMethods ?? DEFAULT_PAYMENT_METHODS
  );
  const [whatsapp, setWhatsapp] = useState<string>(initialData?.whatsapp ?? DEFAULT_WHATSAPP);
  const [branchPhone, setBranchPhone] = useState<string>(
    initialData?.branchPhone ?? DEFAULT_BRANCH_PHONE
  );

  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const markDirty = () => {
    setIsDirty(true);
    setSaveSuccess(false);
  };

  const toggleDay = (index: number) => {
    setWorkingHours((prev) =>
      prev.map((item, i) => (i === index ? { ...item, isOpen: !item.isOpen } : item))
    );
    markDirty();
  };

  const changeTime = (index: number, field: 'openTime' | 'closeTime', value: string) => {
    setWorkingHours((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
    markDirty();
  };

  const applyToAll = (sourceIndex: number) => {
    const source = workingHours[sourceIndex];
    setWorkingHours((prev) =>
      prev.map((item) => ({
        ...item,
        isOpen: source.isOpen,
        openTime: source.openTime,
        closeTime: source.closeTime,
      }))
    );
    markDirty();
  };

  const toggleDelivery = () => {
    setDeliveryEnabled((prev) => !prev);
    markDirty();
  };

  const togglePayment = (methodId: PaymentMethod) => {
    setPaymentMethods((prev) =>
      prev.includes(methodId) ? prev.filter((m) => m !== methodId) : [...prev, methodId]
    );
    markDirty();
  };

  const changeWhatsapp = (value: string) => {
    setWhatsapp(value);
    markDirty();
  };

  const changeBranchPhone = (value: string) => {
    setBranchPhone(value);
    markDirty();
  };

  const save = () => {
    onSave?.({ workingHours, deliveryEnabled, paymentMethods, whatsapp, branchPhone });
    setIsDirty(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const reset = () => {
    setWorkingHours(initialData?.workingHours || DEFAULT_DAYS);
    setDeliveryEnabled(initialData?.deliveryEnabled ?? true);
    setPaymentMethods(initialData?.paymentMethods ?? DEFAULT_PAYMENT_METHODS);
    setWhatsapp(initialData?.whatsapp ?? DEFAULT_WHATSAPP);
    setBranchPhone(initialData?.branchPhone ?? DEFAULT_BRANCH_PHONE);
    setIsDirty(false);
    onCancel?.();
  };

  return {
    workingHours,
    deliveryEnabled,
    paymentMethods,
    whatsapp,
    branchPhone,
    isDirty,
    saveSuccess,
    toggleDay,
    changeTime,
    applyToAll,
    toggleDelivery,
    togglePayment,
    changeWhatsapp,
    changeBranchPhone,
    save,
    reset,
  };
};
