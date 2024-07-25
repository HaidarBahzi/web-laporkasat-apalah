"use client";

import {
  HoneypotInput,
  PasswordInputLogin,
  TextErrorLogin,
} from "@/components/form";
import { WebLoginProcess } from "@/utils/server/auth/login";
import Image from "next/image";
import { useState } from "react";

export default function Page() {
  const [errorMessage, setErrorMessage] = useState({
    message: "",
  });

  async function handleClientSubmit(formData: FormData) {
    setErrorMessage({ message: "" });

    const response = await WebLoginProcess(formData);

    setErrorMessage({ message: response?.message! });
  }

  return (
    <section className="login min-h-screen flex items-center justify-center flex-col gap-10">
      <div className="bg-white w-4/5 sm:w-3/5 md:w-2/3 lg:w-1/2 xl:w-1/3 rou`nded-md flex flex-col justify-center items-center p-5 md:p-10 gap-2">
        <Image
          src="/images/logo/logo-login.webp"
          alt="Logo Login"
          priority={true}
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: "90%", height: "auto" }}
        />
        <form
          action={handleClientSubmit}
          autoComplete="off"
          className="form-control gap-5 justify-center items-center w-full"
        >
          <div className="text-center flex flex-col gap-2">
            <h3 className="text-slate-700 font-medium text-sm md:text-lg">
              Login ke Dashboard
            </h3>
            <div className="text-slate-500 font-normal text-xs">
              Masukkan NIP dan Password Anda:
            </div>
          </div>

          <div className="w-full form-control gap-2">
            <label className="text-xs font-normal text-gray-900">NIP</label>
            <input
              type="text"
              name="pegawaiNip"
              maxLength={18}
              minLength={18}
              className="bg-gray-100 text-gray-900 text-xs rounded focus:bg-gray-200 p-2.5 outline-none w-full"
              placeholder="NIP Anda"
              required
            />
          </div>

          <PasswordInputLogin
            placeholder="Password Anda"
            containerRelative={"w-full"}
            width={"w-full"}
            inputName={"pegawaiPassword"}
            labelText={"Password"}
            required={true}
          />

          <HoneypotInput />

          <TextErrorLogin errorMessage={errorMessage.message} />

          <button
            type="submit"
            className="w-full rounded no-animation border-none text-xs font-medium p-2.5 bg-blue-600 text-white hover:bg-blue-500"
          >
            Login
          </button>
        </form>
      </div>

      <div className="text-xs font-normal text-slate-300">
        Hak Cipta © 2023 SATUAN POLISI PAMONG PRAJA
      </div>
    </section>
  );
}
