import { createRef, MouseEventHandler } from "react";
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaArrowRight,
  FaBalanceScale,
  FaCheck,
  FaDiagnoses,
  FaHandsHelping,
  FaTruckLoading,
  FaUserNinja,
  FaUserTie,
} from "react-icons/fa";
import { IoMdPeople } from "react-icons/io";
import { useWizard } from "react-use-wizard";

interface WizardStepProps {
  stepIndex: number;
  currentStep: number;
}

interface StepLayoutProps {
  stepIndex: number;
  currentStep: number;
  children: React.ReactNode;
  submitFunction?: React.FormEventHandler<HTMLFormElement>;
}

const stepsData = [
  { icon: <FaUserTie />, label: "Pelapor", desc: "Data Pelapor" },
  { icon: <FaDiagnoses />, label: "Kejadian", desc: "Data Kejadian" },
  { icon: <FaUserNinja />, label: "Pelanggar", desc: "Data Pelanggar" },
  { icon: <IoMdPeople />, label: "Saksi", desc: "Data Saksi 1 dan Saksi 2" },
  { icon: <FaHandsHelping />, label: "Tindakan", desc: "Data Tindakan" },
  {
    icon: <FaTruckLoading />,
    label: "Barang Bukti",
    desc: "Data Barang Bukti dan Dokumen",
  },
];

export const WizardStep: React.FC<WizardStepProps> = ({ stepIndex }) => {
  return (
    <ul className="space-y-4">
      {stepsData.map((step, index) => {
        if (index < stepIndex) {
          return (
            <li key={index}>
              <WizardStepDone
                icon={step.icon}
                label={step.label}
                desc={step.desc}
              />
            </li>
          );
        } else if (index === stepIndex) {
          return (
            <li key={index}>
              <WizardStepCurrent
                icon={step.icon}
                label={step.label}
                desc={step.desc}
              />
            </li>
          );
        } else {
          return (
            <li key={index}>
              <WizardStepPending
                icon={step.icon}
                label={step.label}
                desc={step.desc}
              />
            </li>
          );
        }
      })}
    </ul>
  );
};

export const StepLayout: React.FC<StepLayoutProps> = ({
  stepIndex,
  currentStep,
  children,
  submitFunction,
}) => {
  const { previousStep, nextStep } = useWizard();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        if (stepIndex <= 4) {
          nextStep();
        } else {
          submitFunction!(e);
        }
      }}
      className="flex h-full"
    >
      <div className="w-1/3">
        <WizardStep stepIndex={stepIndex} currentStep={currentStep} />
      </div>
      <div className="w-full ml-4 pl-4 border-l-2 form-control gap-4 justify-between border-indigo-500">
        {children}
        <div className="form-control gap-4 justify-self-end">
          <hr />
          <div className="flex justify-between gap-4">
            {stepIndex > 0 && (
              <button
                className="btn bg-blue-100 rounded font-medium text-blue-600 hover:text-white hover:bg-blue-500 no-animation"
                type="button"
                onClick={() => previousStep()}
              >
                <i>
                  <FaAngleDoubleLeft />
                </i>
                SEBELUMNYA
              </button>
            )}

            {stepIndex <= 4 ? (
              <button
                className="btn bg-blue-600 rounded font-medium text-white hover:bg-blue-500 no-animation"
                type="submit"
              >
                <i>
                  <FaAngleDoubleRight />
                </i>
                SELANJUTNYA
              </button>
            ) : (
              <button
                className="btn bg-blue-600 rounded font-medium text-white hover:bg-blue-500 no-animation"
                type="submit"
              >
                <i>
                  <FaBalanceScale />
                </i>
                TINDAK LANJUT
              </button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

export function WizardStepDone({
  icon,
  label,
  desc,
}: {
  icon: React.ReactNode;
  label: string;
  desc: string;
}) {
  return (
    <div
      className="w-full p-2 text-green-700 border border-green-300 rounded-lg bg-green-50"
      role="alert"
    >
      <div className="flex items-center p-1 justify-between">
        <div className="flex items-center gap-3">
          <i className="text-2xl">{icon}</i>
          <div className="form-control gap-1">
            <h3 className="font-medium">{label}</h3>
            <span className="text-sm">{desc}</span>
          </div>
        </div>

        <i>
          <FaCheck />
        </i>
      </div>
    </div>
  );
}

export function WizardStepCurrent({
  icon,
  label,
  desc,
}: {
  icon: React.ReactNode;
  label: string;
  desc: string;
}) {
  return (
    <div
      className="w-full p-2 text-blue-700 bg-blue-100 border border-blue-300 rounded-lg"
      role="alert"
    >
      <div className="flex items-center p-1 justify-between">
        <div className="flex items-center gap-3">
          <i className="text-2xl">{icon}</i>
          <div className="form-control gap-1">
            <h3 className="font-medium">{label}</h3>
            <span className="text-sm">{desc}</span>
          </div>
        </div>

        <i>
          <FaArrowRight />
        </i>
      </div>
    </div>
  );
}

export function WizardStepPending({
  icon,
  label,
  desc,
}: {
  icon: React.ReactNode;
  label: string;
  desc: string;
}) {
  return (
    <div
      className="w-full p-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg"
      role="alert"
    >
      <div className="flex items-center p-1 justify-between">
        <div className="flex items-center gap-3">
          <i className="text-2xl">{icon}</i>
          <div className="form-control gap-1">
            <h3 className="font-medium">{label}</h3>
            <span className="text-sm">{desc}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
