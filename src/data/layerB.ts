import { Question } from './types';

export const layerB: Question[] = [
  { id:'partner_extroversion', text:'Should your partner be outgoing and social?', type:'yesno' },
  { id:'partner_conscientiousness', text:'Is it important your partner is organised?', type:'yesno' },
  { id:'partner_openness', text:'Partner openness to new experiences?', type:'slider' },
  { id:'partner_smoking', text:'Is smoking a deal-breaker for you?', type:'yesno', dealBreaker:true },
  { id:'partner_active', text:'Preferred partner activity level', type:'slider' },
  { id:'partner_family', text:'Must your partner be family-oriented?', type:'yesno', dealBreaker:true },
  { id:'partner_intellectual', text:'Should your partner enjoy intellectual pursuits?', type:'yesno' },
  { id:'partner_travel', text:'Partner should enjoy travelling?', type:'slider' },
  { id:'partner_religion', text:'Must your partner share your religion?', type:'yesno', dealBreaker:true },
  { id:'partner_relocate', text:'Partner willing to relocate for a relationship?', type:'yesno' },
];
