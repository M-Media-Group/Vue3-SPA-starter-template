import { baseGate } from "@m-media/vue3-gate-keeper";

class hasGivenCameraPermission extends baseGate {
  async handle() {
    if (
      !("mediaDevices" in navigator) ||
      !("getUserMedia" in navigator.mediaDevices)
    ) {
      alert("Your browser does not support using a camera.");
      return this.fail();
    }

    return await navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => {})
      .catch(() => {
        alert("You must give us camera permissions to continue.");
        return this.fail();
      });
  }
}

const gate = new hasGivenCameraPermission();

export default (options: any) => {
  return gate.setOptions(options).handle();
};
