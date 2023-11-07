/** @param {NS} ns **/
export async function main(ns) {
  document.getElementById('unclickable').style = "display: block;position: absolute;top: 50%;left: 50%;width: 100px;height: 100px;z-index: 10000;background: red;";
  document.getElementById('unclickable').parentNode.addEventListener('click', () => {
    document.getElementById('unclickable').style = "display: none; visibility: hidden;";
  }, true);
}
