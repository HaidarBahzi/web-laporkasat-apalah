export function ResetVerifyTemplate({ code }: { code: number }) {
  const expiryTime = new Date(Date.now() + 5 * 60 * 1000);
  const expiryTimeFormatted = expiryTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <main>
      <div
        style={{
          textAlign: "center",
          maxWidth: "50%",
          margin: "auto",
          paddingTop: "10vh",
          height: "50vh",
        }}
      >
        <div>
          <h4>
            Anda telah meminta untuk mereset kata sandi akun <i>Lapor Kasat</i>.
            Gunakan kode OTP di bawah ini untuk melanjutkan proses reset kata
            sandi Anda:
          </h4>

          <h1>{code}</h1>

          <h4>
            Kode OTP ini berlaku hingga {expiryTimeFormatted}. Harap untuk tidak
            membagian kode ini. Jika Anda tidak melakukan permintaan ini, mohon
            abaikan email ini.
          </h4>
        </div>

        <div>Hak Cipta © 2024 SATUAN POLISI PAMONG PRAJA.</div>
      </div>
    </main>
  );
}
