

import React from 'react';
import { useLanguage, DoctorProfile } from '../types';

const TeamPage: React.FC = () => {
  const { t } = useLanguage();
  const doctors: DoctorProfile[] = t('ourTeam.doctors');
  const headers: { [key: string]: string } = t('ourTeam.tableHeaders');

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 animate-fade-in">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          {t('ourTeam.title')}
        </h1>
        <p className="mt-4 text-lg text-slate-600">{t('ourTeam.subtitle')}</p>
      </div>

      <div className="mt-16 max-w-4xl mx-auto space-y-8">
        {doctors.map((doctor) => (
          <div key={doctor.name} className="bg-white border border-slate-200 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-corp-blue-dark/50">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{doctor.name}</h2>
                  <p className="text-md font-semibold text-corp-blue-dark">{doctor.specialty}</p>
                </div>
                <div className="flex-shrink-0 bg-slate-100 text-corp-blue-dark font-mono text-xs font-bold px-3 py-1.5 rounded-full">
                  {headers.license}: {doctor.licenseNumber}
                </div>
              </div>
              <p className="mt-4 text-slate-600 text-sm leading-relaxed">{doctor.bio}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamPage;