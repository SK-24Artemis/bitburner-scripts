/** @param {NS} ns */
export async function main(ns) {
    ns.alert(`<iframe
    width="680"
    height="400"
    frameborder="0"
    src="https://dos.zone/player/?bundleUrl=https%3A%2F%2Fcdn.dos.zone%2Fcustom%2Fdos%2Fdoom.jsdos?anonymous=1"
    allowfullscreen>
</iframe>
<!--
  Message 'dz-player-exit' will be fired when js-dos is exited:
  
    window.addEventListener("message", (e) => {
        if (e.data.message === "dz-player-exit") {
            // ...
        }
    });
-->`);
}
