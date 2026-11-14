import { zoek, sorteer, tel, memory, kies } from './basis.js';
import { puzzel, doolhof, aankleden, versieren } from './meer.js';
import { zoekInHuis, bewegen, foto, zingen, qr } from './echt.js';

export const GAMES = { zoek, sorteer, tel, memory, kies, puzzel, doolhof, aankleden, versieren, zoekInHuis, bewegen, foto, zingen, qr };
export const ECHT = new Set(['zoekInHuis', 'bewegen', 'foto', 'zingen', 'qr']);
