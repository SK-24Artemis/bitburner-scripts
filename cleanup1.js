/**
 * WARNING: This script will delete all our scripts and text files.  Make sure
 * the files are backed up somewhere.
 *
 * Remove all our scripts and text files from the home server, except for this
 * script.  If a script is running, it will not be removed.
 *
 * Usage: run cleanup1.js
 *
 * @param ns The Netscript API.
 */
export async function main(ns) {
    const suffix = [".js", ".script", ".ns", ".txt"];
    const rm_file = (file) => ns.rm(file);
    const rm_all_files = (pattern) => ns.ls("home", pattern).forEach(rm_file);
    suffix.forEach(rm_all_files);
}
