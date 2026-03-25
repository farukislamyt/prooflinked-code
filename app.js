// TAB SWITCH
function showTab(tab) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.getElementById(tab).classList.add("active");
}

// 🔐 HASH FUNCTION (SHA-256)
async function hashData(data) {
  const buffer = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(data)
  );

  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

// 🔐 ENCODE
async function encode() {
  const data = document.getElementById("data").value;

  if (!data) {
    alert("Enter data");
    return;
  }

  const hash = await hashData(data);

  const payload = {
    data: data,
    hash: hash
  };

  const token = btoa(JSON.stringify(payload));

  // show token
  document.getElementById("token").innerText = token;

  // generate QR
  QRCode.toCanvas(document.getElementById("qr"), token);
}

// 🔓 DECODE + VERIFY
async function decodeAndVerify(token) {
  try {
    const decoded = JSON.parse(atob(token));

    const newHash = await hashData(decoded.data);

    if (newHash === decoded.hash) {
      return `✅ VALID\n\n${decoded.data}`;
    } else {
      return `❌ TAMPERED\n\n${decoded.data}`;
    }

  } catch (e) {
    return "Invalid QR / Token";
  }
}

// 📷 SCANNER
function startScanner() {
  const scanner = new Html5Qrcode("reader");

  scanner.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    async (text) => {
      scanner.stop();

      const result = await decodeAndVerify(text);
      document.getElementById("result").innerText = result;
    }
  );
}