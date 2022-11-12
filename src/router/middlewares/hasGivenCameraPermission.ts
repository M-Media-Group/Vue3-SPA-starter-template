/** A middleware that checks if the user has given us camera permissions */
export default async () => {
  if (
    !("mediaDevices" in navigator) ||
    !("getUserMedia" in navigator.mediaDevices)
  ) {
    alert("Your browser does not support this feature.");
    return false;
  }

  return await navigator.mediaDevices
    .getUserMedia({ video: true })
    .then(() => {})
    .catch(() => {
      alert("You must enable camera permissions to continue");
      return false;
    });
};
