-- Database initialization for Beep

create table if not exists sessions (
  token text primary key,
  event_code text not null,
  answers jsonb not null,
  created_at timestamptz not null default now()
);

-- Row Level Security
-- Enable RLS in the Supabase dashboard and add a policy:
-- allow users to select only rows where event_code = auth.jwt() ->> 'event_code';
