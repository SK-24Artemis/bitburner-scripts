/** @param {NS} ns */
export async function main(ns) {
    let doc = eval("document");
    // ns.tprint("args: "+ns.args);
    // let doc = ns.args[0];
    ns.bypass(doc);
    ns.tprint(doc);
}
