
document.getElementById("notif").onclick = async () => {
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    alert("Rappels activés !");
  }
};
