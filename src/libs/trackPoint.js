export function recordTrackPoint({ id = '' }, ext = {}) {
    window.hxmClickStat(id, ext);
}
