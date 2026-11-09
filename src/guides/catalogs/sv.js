// Base-game and postgame content share a renderer, with separate per-version progress.
import {SV_GUIDE as SV_BASE,SV_TABS as BASE_TABS} from '../data/sv/base-game.js';
import {SV_POSTGAME} from '../data/sv/postgame.js';
export const SV_GUIDE=[...SV_BASE.map(row=>row.kind==='finale'&&row.id==='the-way-home'?{...row,related:[...(row.related||[]),['postgame','gym-rematches'],['postgame','iv-training']]}:row),...SV_POSTGAME];
export const SV_TABS=[...BASE_TABS.filter(([key])=>key!=='help'),['postgame','После титров','Postgame'],BASE_TABS.find(([key])=>key==='help')];
