import React, { useRef } from "react";

function App() {
  const localVideo = useRef();
  const remoteVideo = useRef();
  const peerRef = useRef();

  // Qo'ng'iroqni boshlash
  const startCall = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideo.current.srcObject = stream;

    peerRef.current = new RTCPeerConnection();

    stream.getTracks().forEach(track => peerRef.current.addTrack(track, stream));

    peerRef.current.ontrack = event => {
      remoteVideo.current.srcObject = event.streams[0];
    };

    const offer = await peerRef.current.createOffer();
    await peerRef.current.setLocalDescription(offer);

    alert("Quyidagi matnni boshqa foydalanuvchiga yuboring (Copy-paste):\n\n" + JSON.stringify(offer));
  };

  // Javobni kiritish
  const setRemote = async () => {
    const answer = prompt("Foydalanuvchidan olingan offer yoki answer matnini kiriting:");
    await peerRef.current.setRemoteDescription(JSON.parse(answer));
  };

  return (
    <div style={{fontFamily: 'sans-serif', padding: 20}}>
      <h2>Oddiy Video Qo‘ng‘iroq (WebRTC)</h2>
      <button onClick={startCall} style={{marginRight: 10}}>Qo‘ng‘iroqni boshlash</button>
      <button onClick={setRemote}>Javobni kiritish</button>
      <div style={{display: "flex", gap: 10, marginTop: 20}}>
        <div>
          <h4>Siz</h4>
          <video ref={localVideo} autoPlay playsInline muted width="240" height="180" style={{background: '#222'}} />
        </div>
        <div>
          <h4>Boshqa foydalanuvchi</h4>
          <video ref={remoteVideo} autoPlay playsInline width="240" height="180" style={{background: '#222'}} />
        </div>
      </div>
      <hr />
      <p style={{marginTop: 30}}>
        <b>Qo‘llanma:</b> <br />
        1. "Qo‘ng‘iroqni boshlash" tugmasini bosing, matn chiqadi. <br />
        2. Ushbu matnni boshqa foydalanuvchiga yuboring (Telegram yoki email orqali).<br />
        3. Ikkinchi foydalanuvchi sizdan olgan matnini o‘z dasturida "Javobni kiritish" tugmasi orqali kiritsin.<br />
        4. Shu tarzda ikkalangiz video orqali bog‘lanasiz.<br />
        <i>Diqqat! Bu test uchun eng oddiy usul, haqiqiy chat uchun server kerak bo‘ladi.</i>
      </p>
    </div>
  );
}

export default App;