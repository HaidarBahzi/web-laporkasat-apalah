"use client";

import { MouseEventHandler, useRef, useEffect, useState } from "react";
import { PiWarningCircle } from "react-icons/pi";
import { PegawaiType, UsersType } from "./options";
import { GetAllUsers } from "@/utils/server/users/user";
import { ButtonActionFunctionMenu } from "./menu";
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaCheckDouble,
  FaSearch,
} from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { GetAllPegawai } from "@/utils/server/pegawai/pegawai";

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
              Silahkan pilih bidang yang menangani laporan ini
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

export function ModalAlertTindak({
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
              Silahkan pilih jenis tindakan untuk laporan ini
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

export function ModalAlertTindakDone({
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
              Silahkan pilih tindakan terakhir anda untuk laporan ini
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

const USERS_PER_PAGE = 5;

export function ModalSearchUser({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userKtp: string, userName: string) => void;
}) {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [users, setUsers] = useState<UsersType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const dialog = modalRef.current;

    const fetchUser = async () => {
      try {
        const callFunction = await GetAllUsers();
        setUsers(callFunction);
      } catch (error) {
        console.log("Gagal dalam mendapatkan data");
      }
    };

    fetchUser();

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

  const totalPages = Math.ceil(users.length / USERS_PER_PAGE);
  const displayedUsers = users.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <dialog
      id="modal_alert"
      className="modal modal-bottom sm:modal-middle"
      ref={modalRef}
    >
      <div className="modal-box p-0 !w-1/2 !max-w-full !rounded">
        <form
          className="bg-blue-500 w-full flex justify-between px-8 items-center h-16"
          method="dialog"
        >
          <div className="text-white flex items-center text-lg font-medium gap-4">
            <i>
              <FaSearch />
            </i>
            Cari Data User
          </div>

          <button
            type="button"
            className="btn btn-sm text-white btn-circle btn-ghost"
            onClick={onClose}
          >
            <i className="text-lg">
              <MdClose />
            </i>
          </button>
        </form>

        <div className="form-control gap-4 p-4">
          {displayedUsers.length > 0 ? (
            <>
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th></th>
                    <th className="font-semibold">NO</th>
                    <th className="font-semibold">KTP USER</th>
                    <th className="font-semibold">NAMA USER</th>
                  </tr>
                </thead>

                <tbody>
                  {displayedUsers.map((user, index) => (
                    <tr key={index}>
                      <td>
                        <ButtonActionFunctionMenu
                          btnFunction={() =>
                            onSubmit(user.user_ktp, user.user_fullname)
                          }
                          btnType={"btn-info"}
                          icon={<FaCheckDouble />}
                        />
                      </td>
                      <td>{(currentPage - 1) * USERS_PER_PAGE + index + 1}</td>
                      <td>{user.user_ktp}</td>
                      <td>{user.user_fullname}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <hr />

              <div className="join flex items-center justify-center gap-8">
                <button
                  className={`join-item ${
                    currentPage === 1 ? "hidden" : "flex"
                  }`}
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  <i>
                    <FaAngleDoubleLeft />
                  </i>
                </button>
                <div className="join-item text-sm font-normal">
                  Page {currentPage} of {totalPages}
                </div>
                <button
                  className={`join-item ${
                    currentPage === totalPages ? "hidden" : "flex"
                  }`}
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  <i>
                    <FaAngleDoubleRight />
                  </i>
                </button>
              </div>
            </>
          ) : (
            <div className="flex justify-center">Tidak ada Data</div>
          )}
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

export function ModalSearchPegawai({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    pegawaiNip: string,
    pegawaiNama: string,
    pegawaiJabatan: string
  ) => void;
}) {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [pegawai, setPegawai] = useState<PegawaiType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const dialog = modalRef.current;

    const fetchUser = async () => {
      try {
        const callFunction = await GetAllPegawai();
        setPegawai(callFunction.pegawai);
      } catch (error) {
        console.log("Gagal dalam mendapatkan data");
      }
    };

    fetchUser();

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

  const totalPages = Math.ceil(pegawai.length / USERS_PER_PAGE);
  const displayedPegawai = pegawai.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <dialog
      id="modal_alert"
      className="modal modal-bottom sm:modal-middle"
      ref={modalRef}
    >
      <div className="modal-box p-0 !w-1/2 !max-w-full !rounded">
        <form
          className="bg-blue-500 w-full flex justify-between px-8 items-center h-16"
          method="dialog"
        >
          <div className="text-white flex items-center text-lg font-medium gap-4">
            <i>
              <FaSearch />
            </i>
            Cari Data Pegawai
          </div>

          <button
            type="button"
            className="btn btn-sm text-white btn-circle btn-ghost"
            onClick={onClose}
          >
            <i className="text-lg">
              <MdClose />
            </i>
          </button>
        </form>

        <div className="form-control gap-4 p-4">
          {displayedPegawai.length > 0 ? (
            <>
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th></th>
                    <th className="font-semibold">NO</th>
                    <th className="font-semibold">NIP PEGAWAI</th>
                    <th className="font-semibold">NAMA PEGAWAI</th>
                    <th className="font-semibold">JABATAN PEGAWAI</th>
                  </tr>
                </thead>

                <tbody>
                  {displayedPegawai.map((pegawai, index) => (
                    <tr key={index}>
                      <td>
                        <ButtonActionFunctionMenu
                          btnFunction={() =>
                            onSubmit(
                              pegawai.pegawai_nip,
                              pegawai.pegawai_nama,
                              pegawai.pegawai_jabatan
                            )
                          }
                          btnType={"btn-info"}
                          icon={<FaCheckDouble />}
                        />
                      </td>
                      <td>{(currentPage - 1) * USERS_PER_PAGE + index + 1}</td>
                      <td>{pegawai.pegawai_nip}</td>
                      <td>{pegawai.pegawai_nama}</td>
                      <td>{pegawai.pegawai_jabatan}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <hr />

              <div className="join flex items-center justify-center gap-8">
                <button
                  className={`join-item ${
                    currentPage === 1 ? "hidden" : "flex"
                  }`}
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  <i>
                    <FaAngleDoubleLeft />
                  </i>
                </button>
                <div className="join-item text-sm font-normal">
                  Page {currentPage} of {totalPages}
                </div>
                <button
                  className={`join-item ${
                    currentPage === totalPages ? "hidden" : "flex"
                  }`}
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  <i>
                    <FaAngleDoubleRight />
                  </i>
                </button>
              </div>
            </>
          ) : (
            <div className="flex justify-center">Tidak ada Data</div>
          )}
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
