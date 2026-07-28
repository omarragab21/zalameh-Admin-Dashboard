import React from 'react';
import { ProfileHeroCard } from '../components/ProfileHeroCard';
import { PersonalInfoForm } from '../components/PersonalInfoForm';
import { ChangePasswordForm } from '../components/ChangePasswordForm';

export const ProfilePage: React.FC = () => {
  return (
    <div className="space-y-6 w-full lg:w-[65%] max-w-4xl mr-0 font-cairo">
      {/* 1. Hero Card */}
      <ProfileHeroCard />

      {/* 2. Personal Information Form */}
      <PersonalInfoForm />

      {/* 3. Change Password Form */}
      <ChangePasswordForm />
    </div>
  );
};
