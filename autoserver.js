let servers = [];

export function autocomplete(data, args) {
    servers = [...data.servers];
    return [...data.servers]; // This script autocompletes the list of servers.
}

/** @param {NS} ns */
export async function main(ns) {
    ns.tail();
    let i = 100;
    while (servers.length <= 0 && i-->0) {
        await ns.sleep(100); ns.tprint('tick', i);
    }

    ns.tprint(servers);
}
