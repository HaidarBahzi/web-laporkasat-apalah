"use client";

import { MouseEventHandler, useEffect, useRef, useState } from "react";

import { FaSave } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FaRegCircleCheck } from "react-icons/fa6";
import { IoIosClose } from "react-icons/io";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { CiExport } from "react-icons/ci";
import { PiWarningCircle } from "react-icons/pi";
import Image from "next/image";

export function TextInput({
  labelText,
  inputName,
  inputType = "text",
  inputPlaceholder,
  defValue,
  readOnly = false,
}: {
  labelText: string;
  inputName: string;
  inputType?: string;
  inputPlaceholder: string;
  defValue?: string;
  readOnly?: boolean;
}) {
  return (
    <>
      <label className="text-xs w-fit font-normal text-gray-900">
        {labelText}
      </label>
      <input
        type={inputType}
        name={inputName}
        defaultValue={defValue}
        readOnly={readOnly}
        className="bg-gray-100 w-full col-span-2 text-gray-900 text-xs rounded focus:bg-gray-200 p-2.5 outline-none"
        placeholder={inputPlaceholder}
        required
      />
    </>
  );
}

export function TextInputUpdate({
  labelText,
  inputName,
  inputType = "text",
  value,
}: {
  labelText: string;
  inputName: string;
  inputType?: string;
  value?: string;
}) {
  return (
    <>
      <label className="text-xs w-fit font-normal text-gray-900">
        {labelText}
      </label>
      <input
        type={inputType}
        name={inputName}
        value={value}
        readOnly={true}
        className="bg-gray-100 w-full col-span-2 text-gray-900 text-xs rounded focus:bg-gray-200 p-2.5 outline-none"
        required
      />
    </>
  );
}

export function WizardTextInput({
  labelText,
  inputName,
  inputType = "text",
  inputPlaceholder,
  defValue,
  onChange,
}: {
  labelText: string;
  inputName: string;
  inputType?: string;
  inputPlaceholder: string;
  defValue?: string;
  onChange: (name: string, value: any) => void;
}) {
  return (
    <>
      <label className="text-xs w-fit font-normal text-gray-900">
        {labelText}
      </label>
      <input
        type={inputType}
        value={defValue}
        onChange={(e) => onChange(inputName, e.target.value)}
        className="bg-gray-100 w-full col-span-2 text-gray-900 text-xs rounded focus:bg-gray-200 p-2.5 outline-none"
        placeholder={inputPlaceholder}
        required
      />
    </>
  );
}

export function WizardTextAreaInput({
  labelText,
  inputName,
  inputPlaceholder,
  defValue,
  onChange,
}: {
  labelText: string;
  inputName: string;
  inputPlaceholder: string;
  defValue?: string;
  onChange: (name: string, value: any) => void;
}) {
  return (
    <>
      <label className="text-xs w-fit font-normal text-gray-900">
        {labelText}
      </label>
      <textarea
        value={defValue}
        onChange={(e) => onChange(inputName, e.target.value)}
        className="bg-gray-100 w-full col-span-2 text-gray-900 text-xs rounded focus:bg-gray-200 p-2.5 outline-none"
        placeholder={inputPlaceholder}
        required
      />
    </>
  );
}

export function LimitedTextInput({
  labelText,
  inputName,
  inputType = "text",
  inputPlaceholder,
  maxLength,
  minLength,
  defValue,
}: {
  labelText: string;
  inputName: string;
  inputType?: string;
  inputPlaceholder: string;
  maxLength: number;
  minLength: number;
  defValue?: string;
}) {
  return (
    <>
      <label className="text-xs w-fit font-normal text-gray-900">
        {labelText}
      </label>
      <input
        type={inputType}
        name={inputName}
        minLength={minLength}
        maxLength={maxLength}
        defaultValue={defValue}
        className="bg-gray-100 w-full col-span-2 text-gray-900 text-xs rounded focus:bg-gray-200 p-2.5 outline-none"
        placeholder={inputPlaceholder}
        required
      />
    </>
  );
}

export function WizardLimitedTextInput({
  labelText,
  inputName,
  inputType = "text",
  inputPlaceholder,
  maxLength,
  minLength,
  defValue,
  onChange,
}: {
  labelText: string;
  inputName: string;
  inputType?: string;
  inputPlaceholder: string;
  maxLength: number;
  minLength: number;
  defValue?: string;
  onChange: (name: string, value: any) => void;
}) {
  return (
    <>
      <label className="text-xs w-fit font-normal text-gray-900">
        {labelText}
      </label>
      <input
        type={inputType}
        name={inputName}
        minLength={minLength}
        maxLength={maxLength}
        defaultValue={defValue}
        className="bg-gray-100 w-full col-span-2 text-gray-900 text-xs rounded focus:bg-gray-200 p-2.5 outline-none"
        placeholder={inputPlaceholder}
        onChange={(e) => onChange(inputName, e.target.value)}
        required
      />
    </>
  );
}

export function DateInput({
  labelText,
  inputName,
  defValue,
  handleChange,
}: {
  labelText: string;
  inputName: string;
  defValue?: string;
  handleChange?: (value: any) => void;
}) {
  const [inputType, setInputType] = useState("text");

  return (
    <>
      <label className="text-xs w-fit font-normal text-gray-900">
        {labelText}
      </label>

      <input
        type={inputType}
        required
        placeholder="DD/MM/YYYY"
        onFocus={() => setInputType("date")}
        onBlur={() => setInputType("text")}
        name={inputName}
        value={defValue}
        onChange={(e) => {
          const selectedValue = e.target.value;
          if (handleChange) {
            handleChange(selectedValue);
          }
        }}
        className="bg-gray-100 w-full col-span-2 text-gray-900 text-xs rounded focus:bg-gray-200 p-2.5 outline-none"
      />
    </>
  );
}

export function WizardDateInput({
  labelText,
  inputName,
  defValue,
  onChange,
}: {
  labelText: string;
  inputName: string;
  defValue?: string;
  onChange: (name: string, value: any) => void;
}) {
  const [inputType, setInputType] = useState("text");

  return (
    <>
      <label className="text-xs w-fit font-normal text-gray-900">
        {labelText}
      </label>

      <input
        type={inputType}
        required
        placeholder="DD/MM/YYYY"
        onFocus={() => setInputType("date")}
        onBlur={() => setInputType("text")}
        name={inputName}
        value={defValue}
        onChange={(e) => {
          const selectedValue = e.target.value;
          if (onChange) {
            onChange(inputName, selectedValue);
          }
        }}
        className="bg-gray-100 w-full col-span-2 text-gray-900 text-xs rounded focus:bg-gray-200 p-2.5 outline-none"
      />
    </>
  );
}

export function DropdownEditInput({
  labelText,
  inputName,
  optionTitle,
  optionValue,
  defaultValue,
  handleChange,
}: {
  labelText: string;
  inputName: string;
  optionTitle: string;
  optionValue: {
    title: string;
    value: any;
  }[];
  defaultValue: any;
  handleChange?: (value: any) => void;
}) {
  return (
    <>
      <label className="text-xs w-fit font-normal text-gray-900">
        {labelText}
      </label>

      <select
        required
        value={defaultValue}
        onChange={(e) => {
          const selectedValue = e.target.value;
          if (handleChange) {
            handleChange(selectedValue);
          }
        }}
        className="bg-gray-100 w-full col-span-2 text-gray-900 text-xs rounded focus:bg-gray-200 p-2.5 outline-none"
        name={inputName}
      >
        <option disabled value={""}>
          - {optionTitle} -
        </option>
        {optionValue.map((option, index) => {
          return (
            <option key={index} value={option.value}>
              {option.title}
            </option>
          );
        })}
      </select>
    </>
  );
}

export function DropdownAddInput({
  labelText,
  inputName,
  optionTitle,
  optionValue,
  defaultValue,
}: {
  labelText: string;
  inputName: string;
  optionTitle: string;
  optionValue: {
    title: string;
    value: any;
  }[];
  defaultValue: any;
}) {
  return (
    <>
      <label className="text-xs w-fit font-normal text-gray-900">
        {labelText}
      </label>

      <select
        required
        defaultValue={defaultValue}
        className="bg-gray-100 w-full col-span-2 text-gray-900 text-xs rounded focus:bg-gray-200 p-2.5 outline-none"
        name={inputName}
      >
        <option disabled value={""}>
          - {optionTitle} -
        </option>
        {optionValue.map((option, index) => {
          return (
            <option key={index} value={option.value}>
              {option.title}
            </option>
          );
        })}
      </select>
    </>
  );
}

export function WizardDropdownInput({
  labelText,
  inputName,
  optionTitle,
  optionValue,
  defaultValue,
  onChange,
}: {
  labelText: string;
  inputName: string;
  optionTitle: string;
  optionValue: {
    title: string;
    value: any;
  }[];
  defaultValue: any;
  onChange: (name: string, value: any) => void;
}) {
  return (
    <>
      <label className="text-xs w-fit font-normal text-gray-900">
        {labelText}
      </label>

      <select
        required
        value={defaultValue}
        onChange={(e) => {
          const selectedValue = e.target.value;
          if (onChange) {
            onChange(inputName, selectedValue);
          }
        }}
        className="bg-gray-100 w-full col-span-2 text-gray-900 text-xs rounded focus:bg-gray-200 p-2.5 outline-none"
        name={inputName}
      >
        <option value={""}>- {optionTitle} -</option>
        {optionValue.map((option, index) => {
          return (
            <option key={index} value={option.value}>
              {option.title}
            </option>
          );
        })}
      </select>
    </>
  );
}

export function RadioInput({
  labelText,
  inputName,
  radioValue,
}: {
  labelText: string;
  inputName: string;
  radioValue: {
    title: string;
    value: any;
  }[];
}) {
  return (
    <>
      <label className="text-xs font-normal text-gray-900">{labelText}</label>

      <div className="flex gap-4 col-span-2">
        {radioValue.map((value, index) => {
          return (
            <label key={index} className="label cursor-pointer gap-2">
              <input
                required
                type="radio"
                name={inputName}
                value={value.value}
                className="radio radio-info h-4 w-4"
              />
              <span className="label-text">{value.title}</span>
            </label>
          );
        })}
      </div>
    </>
  );
}

export function TextareaInput({
  labelText,
  inputName,
  inputPlaceholder,
  defValue,
  readOnly = false,
}: {
  labelText: string;
  inputName: string;
  inputPlaceholder: string;
  defValue?: string;
  readOnly?: boolean;
}) {
  return (
    <>
      <label className="text-xs w-fit font-normal text-gray-900">
        {labelText}
      </label>

      <textarea
        className="textarea bg-gray-100 w-full col-span-2 text-gray-900 text-xs rounded focus:bg-gray-200 p-2.5 outline-none"
        name={inputName}
        placeholder={inputPlaceholder}
        defaultValue={defValue}
        readOnly={readOnly}
      />
    </>
  );
}

export function ImageShow({
  labelText,
  imageSrc,
}: {
  labelText: string;
  imageSrc: string;
}) {
  return (
    <>
      <label className="text-xs font-normal text-gray-900">{labelText}</label>
      <Image
        width={0}
        height={0}
        sizes="100vw"
        src={`${window.location.origin}/foto-pengaduan/${imageSrc}`}
        alt="Selected Image"
        className="w-60 h-40 shadow-lg"
      />
    </>
  );
}

export function DateLaporanInput({
  inputNameFirst,
  inputNameSec,
}: {
  inputNameFirst: string;
  inputNameSec: string;
}) {
  const nowDate = new Date();
  const yesterdayDate = new Date();

  nowDate.setDate(nowDate.getDate() + 1);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const nowValue = formatDate(nowDate);
  const yesterdayValue = formatDate(yesterdayDate);

  return (
    <>
      <label className="text-xs w-fit font-normal text-gray-900">Periode</label>
      <div className="join">
        <input
          type="date"
          name={inputNameFirst}
          className="join-item bg-white rounded border-gray-300 focus:border-blue-400 border outline-none w-full px-2 text-xs text-slate-600"
          defaultValue={yesterdayValue.split("-").reverse().join("-")}
        />

        <div className="join-item bg-slate-100 border border-gray-300 p-2.5">
          ···
        </div>

        <input
          type="date"
          name={inputNameSec}
          className="join-item bg-white rounded border-gray-300 focus:border-blue-400 border outline-none w-full px-2 text-xs text-slate-600"
          defaultValue={nowValue.split("-").reverse().join("-")}
        />
      </div>
    </>
  );
}

export function PasswordInput({
  inputName,
  labelText,
  containerRelative = "",
  width,
  placeholder,
  required,
}: {
  inputName: string;
  labelText: string;
  containerRelative?: string;
  width: string;
  placeholder: string;
  required: boolean;
}) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <>
      <label className="text-xs font-normal text-gray-900">{labelText}</label>

      <div className={`relative col-span-2 ${containerRelative}`}>
        <input
          type={showPassword ? "text" : "password"}
          name={inputName}
          className={`bg-gray-100 ${width} text-gray-900 text-xs rounded focus:bg-gray-200 p-2.5 outline-none`}
          placeholder={placeholder}
          required={required}
          autoComplete="off"
          readOnly={true}
          onClick={(e) => e.currentTarget.removeAttribute("readOnly")}
        />
        <button
          type="button"
          className="absolute top-0 right-2 h-full flex items-center justify-center p-2.5 text-slate-400"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>
    </>
  );
}

export function PasswordInputLogin({
  inputName,
  labelText,
  containerRelative,
  width,
  placeholder,
  defValue,
  required,
}: {
  inputName: string;
  labelText: string;
  containerRelative?: string;
  width: string;
  placeholder: string;
  defValue?: string;
  required: boolean;
}) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };
  return (
    <div className="form-control gap-2 w-full">
      <label className="text-xs font-normal text-gray-900">{labelText}</label>

      <div className={`relative col-span-2 ${containerRelative}`}>
        <input
          type={showPassword ? "text" : "password"}
          name={inputName}
          className={`bg-gray-100 ${width} text-gray-900 text-xs rounded focus:bg-gray-200 p-2.5 outline-none`}
          placeholder={placeholder}
          value={defValue}
          required={required}
        />
        <button
          type="button"
          className="absolute top-0 right-2 h-full flex items-center justify-center p-2.5 text-slate-400"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>
    </div>
  );
}

export function InputDateLaporan({
  labelText,
  inputYesterdayName,
  inputNowName,
}: {
  labelText: string;
  inputYesterdayName: string;
  inputNowName: string;
}) {
  const nowDate = new Date();
  const yesterayDate = new Date();

  nowDate.setDate(nowDate.getDate());
  yesterayDate.setDate(yesterayDate.getDate() - 1);

  const nowValue = nowDate.toLocaleDateString("en-CA");
  const yesterdayValue = yesterayDate.toLocaleDateString("en-CA");

  return (
    <>
      <label className="text-xs font-normal text-gray-900">{labelText}</label>

      <div className="join">
        <input
          type="date"
          name={inputYesterdayName}
          className="join-item bg-white rounded border-gray-300 focus:border-blue-400 border outline-none py-2.5 px-5 text-sm text-slate-600"
          defaultValue={yesterdayValue}
        />

        <div className="join-item bg-slate-100 border border-gray-300 p-2.5 text-slate-600">
          ···
        </div>

        <input
          type="date"
          name={inputNowName}
          className="join-item bg-white rounded border-gray-300 focus:border-blue-400 border outline-none py-2.5 px-5 text-sm text-slate-600"
          defaultValue={nowValue}
        />
      </div>
    </>
  );
}

export function HoneypotInput() {
  return <input type="hidden" name="userHoneypot" value="" />;
}

export function TextErrorLogin({ errorMessage }: { errorMessage: string }) {
  return (
    <div
      role="alert"
      className={` ${
        errorMessage ? "alert !py-2 alert-error rounded" : "hidden"
      }`}
    >
      <span className="text-white text-xs font-medium">{errorMessage}</span>
    </div>
  );
}

export function ButtonSubmit() {
  return (
    <button
      type="submit"
      className="btn rounded no-animation border-none font-semibold bg-blue-600 text-white hover:bg-blue-500"
    >
      <i>
        <FaSave />
      </i>
      Simpan
    </button>
  );
}

export function ButtonExport() {
  return (
    <button
      type="submit"
      className="btn rounded no-animation border-none font-semibold bg-blue-600 text-white hover:bg-blue-500"
    >
      <i>
        <CiExport />
      </i>
      Simpan
    </button>
  );
}

export function DetailButtonSubmit({
  onPress,
  icon,
  title,
}: {
  onPress: MouseEventHandler<HTMLButtonElement>;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <button
      onClick={onPress}
      className="btn rounded no-animation border-none font-semibold bg-blue-600 text-white hover:bg-blue-500"
    >
      <i>{icon}</i> {title}
    </button>
  );
}

export function FailNotification({
  title,
  buttonFunction,
}: {
  title: string;
  buttonFunction: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <div role="alert" className="alert rounded p-3.5 alert-error text-white">
      <i className="text-xl">
        <AiOutlineCloseCircle />
      </i>
      <span>{title}</span>

      <button className="text-2xl" onClick={buttonFunction}>
        <IoIosClose />
      </button>
    </div>
  );
}

export function SuccessNotification({
  title,
  buttonFunction,
}: {
  title: string;
  buttonFunction: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <div role="alert" className="alert rounded p-3.5 alert-success text-white">
      <i className="text-xl">
        <FaRegCircleCheck />
      </i>
      <span>{title}</span>

      <button className="text-2xl" onClick={buttonFunction}>
        <IoIosClose />
      </button>
    </div>
  );
}

export function ModalAlertDelete({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: MouseEventHandler<HTMLButtonElement>;
}) {
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = modalRef.current;

    if (isOpen && dialog) {
      dialog.showModal();
    } else if (!isOpen && dialog) {
      dialog.close();
    }

    const handleClose = () => {
      onClose();
    };

    if (dialog) {
      dialog.addEventListener("close", handleClose);
    }

    return () => {
      if (dialog) {
        dialog.removeEventListener("close", handleClose);
      }
    };
  }, [isOpen, onClose]);

  return (
    <dialog
      id="modal_alert"
      className="modal modal-bottom sm:modal-middle"
      ref={modalRef}
    >
      <div className="modal-box !w-96 !rounded">
        <form method="dialog">
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={onClose}
          >
            ✕
          </button>
        </form>

        <div className="form-control justify-center items-center gap-6">
          <i className="text-8xl text-yellow-500">
            <PiWarningCircle />
          </i>

          <div className="form-control justify-center items-center gap-4">
            <h3 className="font-medium text-xl">Anda Yakin?</h3>
            <p className="text-center text-sm tracking-wide">
              Apakah anda yakin ingin menghapus data ini? Tindakan ini tidak
              bisa dibatalkan.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              className="btn min-h-10 h-10 w-32 bg-blue-600 hover:bg-blue-700 rounded text-white"
              onClick={onSubmit}
            >
              Hapus
            </button>
            <button
              className="btn min-h-10 h-10 w-24 bg-red-600 hover:bg-red-700 rounded text-white"
              onClick={onClose}
            >
              Tidak
            </button>
          </div>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

export function ModalAlertEdit({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: MouseEventHandler<HTMLButtonElement>;
}) {
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = modalRef.current;

    if (isOpen && dialog) {
      dialog.showModal();
    } else if (!isOpen && dialog) {
      dialog.close();
    }

    const handleClose = () => {
      onClose();
    };

    if (dialog) {
      dialog.addEventListener("close", handleClose);
    }

    return () => {
      if (dialog) {
        dialog.removeEventListener("close", handleClose);
      }
    };
  }, [isOpen, onClose]);

  return (
    <dialog
      id="modal_alert"
      className="modal modal-bottom sm:modal-middle"
      ref={modalRef}
    >
      <div className="modal-box !w-96 !rounded">
        <form method="dialog">
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={onClose}
          >
            ✕
          </button>
        </form>

        <div className="form-control justify-center items-center gap-6">
          <i className="text-8xl text-yellow-500">
            <PiWarningCircle />
          </i>

          <div className="form-control justify-center items-center gap-4">
            <h3 className="font-medium text-xl">Anda Yakin?</h3>
            <p className="text-center text-sm tracking-wide">
              Apakah anda yakin ingin mengubah data ini? Tindakan ini tidak bisa
              dibatalkan.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              className="btn min-h-10 h-10 w-32 bg-blue-600 hover:bg-blue-700 rounded text-white"
              onClick={onSubmit}
            >
              Ubah
            </button>
            <button
              className="btn min-h-10 h-10 w-24 bg-red-600 hover:bg-red-700 rounded text-white"
              onClick={onClose}
            >
              Tidak
            </button>
          </div>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

export function ModalAlertAdd({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: MouseEventHandler<HTMLButtonElement>;
}) {
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = modalRef.current;

    if (isOpen && dialog) {
      dialog.showModal();
    } else if (!isOpen && dialog) {
      dialog.close();
    }

    const handleClose = () => {
      onClose();
    };

    if (dialog) {
      dialog.addEventListener("close", handleClose);
    }

    return () => {
      if (dialog) {
        dialog.removeEventListener("close", handleClose);
      }
    };
  }, [isOpen, onClose]);

  return (
    <dialog
      id="modal_alert"
      className="modal modal-bottom sm:modal-middle"
      ref={modalRef}
    >
      <div className="modal-box !w-96 !rounded">
        <form method="dialog">
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={onClose}
          >
            ✕
          </button>
        </form>

        <div className="form-control justify-center items-center gap-6">
          <i className="text-8xl text-yellow-500">
            <PiWarningCircle />
          </i>

          <div className="form-control justify-center items-center gap-4">
            <h3 className="font-medium text-xl">Anda Yakin?</h3>
            <p className="text-center text-sm tracking-wide">
              Apakah anda yakin ingin menambah data ini? Tindakan ini tidak bisa
              dibatalkan.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              className="btn min-h-10 h-10 w-32 bg-blue-600 hover:bg-blue-700 rounded text-white"
              onClick={onSubmit}
            >
              Tambah
            </button>
            <button
              className="btn min-h-10 h-10 w-24 bg-red-600 hover:bg-red-700 rounded text-white"
              onClick={onClose}
            >
              Tidak
            </button>
          </div>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

export function ModalAlertApprove({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: MouseEventHandler<HTMLButtonElement>;
}) {
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = modalRef.current;

    if (isOpen && dialog) {
      dialog.showModal();
    } else if (!isOpen && dialog) {
      dialog.close();
    }

    const handleClose = () => {
      onClose();
    };

    if (dialog) {
      dialog.addEventListener("close", handleClose);
    }

    return () => {
      if (dialog) {
        dialog.removeEventListener("close", handleClose);
      }
    };
  }, [isOpen, onClose]);

  return (
    <dialog
      id="modal_alert"
      className="modal modal-bottom sm:modal-middle"
      ref={modalRef}
    >
      <div className="modal-box !w-96 !rounded">
        <form method="dialog">
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={onClose}
          >
            ✕
          </button>
        </form>

        <div className="form-control justify-center items-center gap-6">
          <i className="text-8xl text-yellow-500">
            <PiWarningCircle />
          </i>

          <div className="form-control justify-center items-center gap-4">
            <h3 className="font-medium text-xl">Anda Yakin?</h3>
            <p className="text-center text-sm tracking-wide">
              Apakah anda yakin ingin mengapprove laporan ini? Tindakan ini
              tidak bisa dibatalkan.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              className="btn min-h-10 h-10 w-32 bg-blue-600 hover:bg-blue-700 rounded text-white"
              onClick={onSubmit}
            >
              Approve
            </button>
            <button
              className="btn min-h-10 h-10 w-24 bg-red-600 hover:bg-red-700 rounded text-white"
              onClick={onClose}
            >
              Tidak
            </button>
          </div>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

export function ModalAlertApproveBidang({
  inputName,
  optionTitle,
  optionValue,
  defaultValue,
  isOpen,
  handleChange,
  onClose,
  onSubmit,
}: {
  inputName: string;
  optionTitle: string;
  optionValue: {
    title: string;
    value: any;
  }[];
  defaultValue: any;
  isOpen: boolean;
  handleChange?: (value: any) => void;
  onClose: () => void;
  onSubmit: MouseEventHandler<HTMLButtonElement>;
}) {
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = modalRef.current;

    if (isOpen && dialog) {
      dialog.showModal();
    } else if (!isOpen && dialog) {
      dialog.close();
    }

    const handleClose = () => {
      onClose();
    };

    if (dialog) {
      dialog.addEventListener("close", handleClose);
    }

    return () => {
      if (dialog) {
        dialog.removeEventListener("close", handleClose);
      }
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(e as unknown as React.MouseEvent<HTMLButtonElement>);
  };

  return (
    <dialog
      id="modal_alert"
      className="modal modal-bottom sm:modal-middle"
      ref={modalRef}
    >
      <div className="modal-box !w-96 !rounded">
        <form method="dialog">
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={onClose}
          >
            ✕
          </button>
        </form>

        <div className="form-control justify-center items-center gap-6">
          <i className="text-8xl text-yellow-500">
            <PiWarningCircle />
          </i>

          <form
            className="form-control justify-center items-center gap-4"
            onSubmit={handleSubmit}
          >
            <h3 className="font-medium text-center text-xl">
              Silahkan Pilih Bidang yang menangani laporan ini
            </h3>
            <select
              required
              defaultValue={defaultValue}
              onChange={(e) => {
                const selectedValue = e.target.value;
                if (handleChange) {
                  handleChange(selectedValue);
                }
              }}
              className="bg-gray-100 w-full col-span-2 text-gray-900 text-xs rounded focus:bg-gray-200 p-2.5 outline-none"
              name={inputName}
            >
              <option disabled value={""}>
                - {optionTitle} -
              </option>
              {optionValue.map((option, index) => {
                return (
                  <option key={index} value={option.value}>
                    {option.title}
                  </option>
                );
              })}
            </select>

            <div className="flex gap-2">
              <button
                type="submit"
                className="btn min-h-10 h-10 w-32 bg-blue-600 hover:bg-blue-700 rounded text-white"
              >
                Pilih
              </button>
              <button
                type="button"
                className="btn min-h-10 h-10 w-24 bg-red-600 hover:bg-red-700 rounded text-white"
                onClick={onClose}
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

export function ModalAlertProgress({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: MouseEventHandler<HTMLButtonElement>;
}) {
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = modalRef.current;

    if (isOpen && dialog) {
      dialog.showModal();
    } else if (!isOpen && dialog) {
      dialog.close();
    }

    const handleClose = () => {
      onClose();
    };

    if (dialog) {
      dialog.addEventListener("close", handleClose);
    }

    return () => {
      if (dialog) {
        dialog.removeEventListener("close", handleClose);
      }
    };
  }, [isOpen, onClose]);

  return (
    <dialog
      id="modal_alert"
      className="modal modal-bottom sm:modal-middle"
      ref={modalRef}
    >
      <div className="modal-box !w-96 !rounded">
        <form method="dialog">
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={onClose}
          >
            ✕
          </button>
        </form>

        <div className="form-control justify-center items-center gap-6">
          <i className="text-8xl text-yellow-500">
            <PiWarningCircle />
          </i>

          <div className="form-control justify-center items-center gap-4">
            <h3 className="font-medium text-xl">Anda Yakin?</h3>
            <p className="text-center text-sm tracking-wide">
              Apakah anda yakin ingin menindaklanjuti laporan ini? Tindakan ini
              tidak bisa dibatalkan.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              className="btn min-h-10 h-10 w-32 bg-blue-600 hover:bg-blue-700 rounded text-white"
              onClick={onSubmit}
            >
              Tindak
            </button>
            <button
              className="btn min-h-10 h-10 w-24 bg-red-600 hover:bg-red-700 rounded text-white"
              onClick={onClose}
            >
              Tidak
            </button>
          </div>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
export function ModalAlertDone({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: MouseEventHandler<HTMLButtonElement>;
}) {
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = modalRef.current;

    if (isOpen && dialog) {
      dialog.showModal();
    } else if (!isOpen && dialog) {
      dialog.close();
    }

    const handleClose = () => {
      onClose();
    };

    if (dialog) {
      dialog.addEventListener("close", handleClose);
    }

    return () => {
      if (dialog) {
        dialog.removeEventListener("close", handleClose);
      }
    };
  }, [isOpen, onClose]);

  return (
    <dialog
      id="modal_alert"
      className="modal modal-bottom sm:modal-middle"
      ref={modalRef}
    >
      <div className="modal-box !w-96 !rounded">
        <form method="dialog">
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={onClose}
          >
            ✕
          </button>
        </form>

        <div className="form-control justify-center items-center gap-6">
          <i className="text-8xl text-yellow-500">
            <PiWarningCircle />
          </i>

          <div className="form-control justify-center items-center gap-4">
            <h3 className="font-medium text-xl">Anda Yakin?</h3>
            <p className="text-center text-sm tracking-wide">
              Apakah anda yakin ingin menambah data ini? Tindakan ini tidak bisa
              dibatalkan.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              className="btn min-h-10 h-10 w-32 bg-blue-600 hover:bg-blue-700 rounded text-white"
              onClick={onSubmit}
            >
              Tambah
            </button>
            <button
              className="btn min-h-10 h-10 w-24 bg-red-600 hover:bg-red-700 rounded text-white"
              onClick={onClose}
            >
              Tidak
            </button>
          </div>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

export function ModalAlertCantDelete({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = modalRef.current;

    if (isOpen && dialog) {
      dialog.showModal();
    } else if (!isOpen && dialog) {
      dialog.close();
    }

    const handleClose = () => {
      onClose();
    };

    if (dialog) {
      dialog.addEventListener("close", handleClose);
    }

    return () => {
      if (dialog) {
        dialog.removeEventListener("close", handleClose);
      }
    };
  }, [isOpen, onClose]);

  return (
    <dialog
      id="modal_alert"
      className="modal modal-bottom sm:modal-middle"
      ref={modalRef}
    >
      <div className="modal-box !w-96 !rounded">
        <form method="dialog">
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={onClose}
          >
            ✕
          </button>
        </form>

        <div className="form-control justify-center items-center gap-6">
          <i className="text-8xl text-yellow-500">
            <PiWarningCircle />
          </i>

          <div className="form-control justify-center items-center gap-4">
            <h3 className="font-medium text-xl">Peringatan</h3>
            <p className="text-center text-sm tracking-wide">
              Tidak dapat menghapus data ini
            </p>
          </div>

          <div className="flex">
            <button
              className="btn min-h-10 h-10 w-60 bg-blue-600 hover:bg-blue-700 rounded text-white"
              onClick={onClose}
            >
              OK
            </button>
          </div>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

export function ModalAlertLogout({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: MouseEventHandler<HTMLButtonElement>;
}) {
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = modalRef.current;

    if (isOpen && dialog) {
      dialog.showModal();
    } else if (!isOpen && dialog) {
      dialog.close();
    }

    const handleClose = () => {
      onClose();
    };

    if (dialog) {
      dialog.addEventListener("close", handleClose);
    }

    return () => {
      if (dialog) {
        dialog.removeEventListener("close", handleClose);
      }
    };
  }, [isOpen, onClose]);

  return (
    <dialog
      id="modal_alert"
      className="modal modal-bottom sm:modal-middle"
      ref={modalRef}
    >
      <div className="modal-box !w-96 !rounded">
        <form method="dialog">
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={onClose}
          >
            ✕
          </button>
        </form>

        <div className="form-control justify-center items-center gap-6">
          <i className="text-8xl text-yellow-500">
            <PiWarningCircle />
          </i>

          <div className="form-control justify-center items-center gap-4">
            <h3 className="font-medium text-xl">Anda Yakin?</h3>
            <p className="text-center text-sm tracking-wide">
              Apakah anda yakin untuk logout?
            </p>
          </div>

          <div className="flex gap-2">
            <button
              className="btn min-h-10 h-10 w-32 bg-blue-600 hover:bg-blue-700 rounded text-white"
              onClick={onSubmit}
            >
              OK
            </button>
            <button
              className="btn min-h-10 h-10 w-24 bg-red-600 hover:bg-red-700 rounded text-white"
              onClick={onClose}
            >
              Batal
            </button>
          </div>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
