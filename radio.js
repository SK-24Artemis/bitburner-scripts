globalThis.STATIONS = [
  ["Chilltrax", "https://streamssl.chilltrax.com/stream/1/"],
  ["Rekt", "https://stream.nightride.fm/rekt.m4a"],
  ["Nightride", "https://stream.nightride.fm/nightride.m4a"],
  ["Rektory", "https://stream.nightride.fm/rektory.m4a"],
  ["Chillsynth", "https://stream.nightride.fm/chillsynth.m4a"],
  ["Spacesynth", "https://stream.nightride.fm/spacesynth.m4a"],
  ["Darksynth", "https://stream.nightride.fm/darksynth.m4a"],
  ["Horrorsynth", "https://stream.nightride.fm/horrorsynth.m4a"],
  ["EBSM", "https://stream.nightride.fm/ebsm.m4a"],
  ["Datawave", "https://stream.nightride.fm/datawave.m4a"]
]
globalThis.musicSource = 0;

/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog("ALL");
  ns.tail();
  await ns.asleep(1000);
  globalThis.tailWin = Array.prototype.slice.call(eval("document").getElementsByTagName("h6")).filter(el => el.textContent.trim() === ("radio"+".js").trim())[0];
  ns.print("You should be able to now minimize this window and control the radio via the two buttons to the left of the station name.")
  ns.atExit(() => { globalThis.tailWin.innerHTML = "<div id='radio'><font color='" + ns.ui.getTheme()['primary'] + "'><a onclick='globalThis.musicPlaying = !globalThis.musicPlaying; document.getElementById(`radioplayer`)[globalThis.musicPlaying ? `play` : `pause`]()'>&gt;</a> <a onclick='globalThis.musicSource += 1; document.getElementById(`radioplayer`).src=globalThis.STATIONS[globalThis.musicSource % globalThis.STATIONS.length][1];document.getElementById(`radioplayer`)[globalThis.musicPlaying ? `play` : `pause`]();document.getElementById(`musicTitle`).innerText=globalThis.STATIONS[globalThis.musicSource % globalThis.STATIONS.length][0]'>|> </a><audio id='radioplayer' src='https://stream.nightride.fm/rekt.m4a'></audio><span class='MuiTypography-root MuiTypography-body1' id='musicTitle'>Rekt</span></font></div>" });
}
