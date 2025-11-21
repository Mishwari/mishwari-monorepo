interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
}

export default function WizardProgress({ currentStep, totalSteps }: WizardProgressProps) {
  return (
    <div className="flex justify-between mb-8">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div
          key={step}
          className={`flex-1 ${step !== totalSteps ? 'border-l-2' : ''} ${
            currentStep >= step ? 'border-primary' : 'border-gray-300'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center font-semibold ${
              currentStep >= step ? 'bg-primary text-white' : 'bg-gray-300 text-gray-600'
            }`}
          >
            {step}
          </div>
        </div>
      ))}
    </div>
  );
}
