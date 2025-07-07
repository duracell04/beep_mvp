import { Question } from './types';

export const layerA: Question[] = [
  { id:'extroversion', text:'Are you outgoing and energized by social interactions?', type:'yesno', weight:4 },
  { id:'conscientiousness', text:'Do you consider yourself organized and goal-oriented?', type:'yesno', weight:3 },
  { id:'openness', text:'How open are you to new experiences and ideas?', type:'slider', weight:4 },
  { id:'smoking', text:'Do you smoke cigarettes or vape regularly?', type:'yesno', weight:3 },
  { id:'active_lifestyle', text:'How active is your lifestyle?', type:'slider', weight:3 },
  { id:'family_oriented', text:'Is family a central part of your life?', type:'yesno', weight:4 },
  { id:'intellectual', text:'Do you enjoy intellectual pursuits?', type:'yesno', weight:3 },
  { id:'travel', text:'How much do you enjoy travelling?', type:'slider', weight:3 },
  { id:'religion', text:'Do you actively practise a religion?', type:'yesno', weight:2 },
  { id:'social_preference', text:'On weekends, I prefer to…', type:'select', options:['Go out & socialise','Stay in & relax'], weight:3 },
];
