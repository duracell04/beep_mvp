export interface RapidOption {
  value: string;
  label: string;
  note?: string;
}

export interface RapidQuestion {
  id: string;
  badge: string;
  question: string;
  description?: string;
  options: RapidOption[];
  layer: 'A' | 'B';
  weight?: number;
  allowDealBreaker?: boolean;
  sparkTemplate: string;
  promptTemplate: string;
}

const replaceToken = (template: string, answer: string) =>
  template.replace('{answer}', answer);

export const rapidFireQuestions: RapidQuestion[] = [
  {
    id: 'department',
    badge: 'Role Signal',
    question: 'Department?',
    description: 'Instantly show cross-functional coverage for the buyer.',
    layer: 'A',
    weight: 1.1,
    options: [
      { value: 'sales', label: 'Sales', note: 'Quota crushers & demo pros' },
      { value: 'tech', label: 'Product & Tech', note: 'Builders, PMs, data' },
      { value: 'people', label: 'People & Ops', note: 'HR, Finance, Legal' },
      { value: 'customers', label: 'Customer Success', note: 'CSM & Support' },
    ],
    sparkTemplate: "You both represent {answer} - no translation required.",
    promptTemplate: 'Ask them: What is the boldest {answer} win on your roadmap?'
  },
  {
    id: 'superpower',
    badge: 'Culture Cue',
    question: 'Office superpower?',
    description: 'Make the icebreaker playful but still work-relevant.',
    layer: 'A',
    weight: 1.0,
    options: [
      { value: 'excel', label: 'Excel Wizard', note: 'Pivot tables on demand' },
      { value: 'coffee', label: 'Coffee Brewer', note: 'Keeps the floor buzzing' },
      { value: 'bug', label: 'Bug Fixer', note: 'Drops into crisis mode' },
      { value: 'story', label: 'Storyteller', note: 'Turns work into wins' },
    ],
    sparkTemplate: 'Shared flex: both of you own the {answer} badge.',
    promptTemplate: 'Ask them: When did that {answer} talent save a project?'
  },
  {
    id: 'summit_mission',
    badge: 'Intent',
    question: 'Mission for today?',
    description: 'Signals what they expect from the event.',
    layer: 'A',
    weight: 1.2,
    options: [
      { value: 'pipeline', label: 'Pipeline leads', note: 'Chasing new accounts' },
      { value: 'implementation', label: 'Implementation intel', note: 'Playbook nerds' },
      { value: 'talent', label: 'People introductions', note: 'Hiring, partners' },
      { value: 'alignment', label: 'Executive alignment', note: 'Stakeholder syncs' },
    ],
    sparkTemplate: 'Same mission: both chasing {answer}.',
    promptTemplate: 'Ask them: What will prove today was worth hopping on a plane?'
  },
  {
    id: 'cadence',
    badge: 'Collaboration',
    question: 'Decision cadence?',
    layer: 'A',
    weight: 0.8,
    options: [
      { value: 'ship', label: 'Ship-first, iterate', note: 'Bias for action' },
      { value: 'data', label: 'Need the data room', note: 'Receipts or bust' },
      { value: 'tour', label: 'Alignment tour', note: 'Bring everyone along' },
    ],
    sparkTemplate: 'You sync on cadence: {answer}.',
    promptTemplate: 'Ask them: When does that cadence absolutely pay off?'
  },
  {
    id: 'work_model',
    badge: 'Ways of Working',
    question: 'Hybrid handshake?',
    layer: 'A',
    weight: 0.9,
    options: [
      { value: 'remote', label: 'Remote-first', note: 'Async rituals' },
      { value: 'hybrid', label: '3-day hybrid', note: 'Most teams follow this' },
      { value: 'hq', label: 'HQ loyalist', note: 'Office energy matters' },
    ],
    sparkTemplate: 'You both thrive in a {answer} rhythm.',
    promptTemplate: 'Ask them: What keeps that rhythm healthy for the team?'
  },
  {
    id: 'conversation_stage',
    badge: 'Event Flow',
    question: 'Best place to host a convo?',
    layer: 'B',
    allowDealBreaker: true,
    options: [
      { value: 'demo', label: 'Product demo bar', note: 'Hands-on energy' },
      { value: 'roundtable', label: 'Roundtable huddles', note: 'Curated peers' },
      { value: 'hallway', label: 'Hallway laps', note: 'Walk & talk' },
    ],
    sparkTemplate: '{answer} is your shared arena.',
    promptTemplate: 'Ask them: Who should crash our next {answer} session?'
  },
  {
    id: 'toolkit',
    badge: 'Stack Pride',
    question: 'Internal tool flex?',
    layer: 'B',
    options: [
      { value: 'salesforce', label: 'Salesforce dashboards', note: 'Revenue ops' },
      { value: 'notion', label: 'Notion wikis', note: 'Live playbooks' },
      { value: 'jira', label: 'Jira boards', note: 'Delivery heartbeat' },
      { value: 'slack', label: 'Slack huddles', note: 'Instant stand-ups' },
    ],
    sparkTemplate: 'Shared stack love: {answer}.',
    promptTemplate: 'Ask them: What automation around {answer} should exist?'
  },
  {
    id: 'celebration',
    badge: 'Team Rituals',
    question: 'Win celebration style?',
    layer: 'B',
    options: [
      { value: 'data_drop', label: 'Data drop in Slack', note: "Receipts or it didn't happen" },
      { value: 'espresso', label: 'Espresso run', note: 'Caffeine lap for the crew' },
      { value: 'shoutout', label: 'People shoutout wall', note: 'Name the humans' },
    ],
    sparkTemplate: 'Win rituals match: {answer}.',
    promptTemplate: 'Ask them: Which recent win earned the loudest {answer}?'
  },
  {
    id: 'future_topic',
    badge: 'Future Lens',
    question: 'Future-of-work obsession?',
    layer: 'B',
    options: [
      { value: 'copilots', label: 'AI copilots for ops', note: 'Smarter workflows' },
      { value: 'revops', label: 'Revenue ops automation', note: 'Less swivel-chair' },
      { value: 'change', label: 'Change management', note: 'Humans through shifts' },
      { value: 'customer_marketing', label: 'Customer marketing', note: 'Turn users into fans' },
    ],
    sparkTemplate: 'Both of you can riff on {answer} all day.',
    promptTemplate: 'Ask them: What is the most overrated take about {answer}?'
  },
  {
    id: 'icebreaker',
    badge: 'Conversation Style',
    question: 'How do you open?',
    layer: 'B',
    allowDealBreaker: true,
    options: [
      { value: 'tactical', label: 'Tactical question', note: 'Get into the work' },
      { value: 'challenge', label: 'Bold challenge', note: 'Throw a lightning round' },
      { value: 'origin', label: 'Personal origin story', note: 'Context first' },
    ],
    sparkTemplate: 'You both start with a {answer}.',
    promptTemplate: 'Ask them: What opener never fails when the room is cold?'
  },
];

export const describeSharedAnswer = (id: string, answer: string) => {
  const question = rapidFireQuestions.find((q) => q.id === id);
  if (!question) {
    return {
      topic: 'Shared curiosity',
      sparkLine: answer,
      promptLine: 'Ask them: What should we build together from here?'
    };
  }
  return {
    topic: question.question,
    sparkLine: replaceToken(question.sparkTemplate, answer),
    promptLine: replaceToken(question.promptTemplate, answer),
  };
};
