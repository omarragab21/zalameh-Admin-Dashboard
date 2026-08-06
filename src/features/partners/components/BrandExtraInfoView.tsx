import React from 'react';
import type { BrandExtraInfo } from '../types/partner.types';
import { useBrandExtraInfoForm } from './extra-info/useBrandExtraInfoForm';
import { WorkingHoursCard } from './extra-info/WorkingHoursCard';
import { DeliveryServiceCard } from './extra-info/DeliveryServiceCard';
import { PaymentMethodsCard } from './extra-info/PaymentMethodsCard';
import { ContactInfoCard } from './extra-info/ContactInfoCard';
import { SaveActionBar } from './extra-info/SaveActionBar';

interface BrandExtraInfoViewProps {
  initialData?: BrandExtraInfo;
  onSave?: (data: BrandExtraInfo) => void;
  onCancel?: () => void;
}

export const BrandExtraInfoView: React.FC<BrandExtraInfoViewProps> = ({
  initialData,
  onSave,
  onCancel,
}) => {
  const form = useBrandExtraInfoForm({ initialData, onSave, onCancel });

  return (
    <div className="space-y-6 animate-fadeIn" dir="rtl">
      <WorkingHoursCard
        workingHours={form.workingHours}
        onToggleDay={form.toggleDay}
        onChangeTime={form.changeTime}
        onApplyToAll={form.applyToAll}
      />

      <DeliveryServiceCard
        deliveryEnabled={form.deliveryEnabled}
        onToggle={form.toggleDelivery}
      />

      <PaymentMethodsCard
        paymentMethods={form.paymentMethods}
        onToggle={form.togglePayment}
      />

      <ContactInfoCard
        whatsapp={form.whatsapp}
        branchPhone={form.branchPhone}
        onChangeWhatsapp={form.changeWhatsapp}
        onChangeBranchPhone={form.changeBranchPhone}
      />

      <SaveActionBar
        isDirty={form.isDirty}
        saveSuccess={form.saveSuccess}
        onSave={form.save}
        onCancel={form.reset}
      />
    </div>
  );
};
