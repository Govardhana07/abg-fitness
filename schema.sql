-- ABG starter schema for Supabase/Postgres. Review with a qualified developer before production.
create extension if not exists pgcrypto;
create table if not exists public.profiles (
 user_id uuid primary key references auth.users(id) on delete cascade,
 display_name text not null default '',
 goal text not null default 'general_fitness' check (goal in ('fat_loss','muscle_gain','general_fitness','strength')),
 units text not null default 'metric' check (units in ('metric','imperial')),
 height_cm numeric check (height_cm between 80 and 250),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.workout_logs (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 workout_name text not null, completed_at timestamptz not null default now(), duration_minutes int check (duration_minutes between 0 and 600), notes text
);
create table if not exists public.exercise_sets (
 id uuid primary key default gen_random_uuid(), workout_log_id uuid not null references public.workout_logs(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade, exercise_name text not null,
 set_number int not null check (set_number > 0), reps int check (reps >= 0), weight_kg numeric check (weight_kg >= 0), created_at timestamptz not null default now()
);
create table if not exists public.meal_logs (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 eaten_at timestamptz not null default now(), food_name text not null, serving_description text not null default '1 serving',
 calories numeric check (calories >= 0), protein_g numeric check (protein_g >= 0), carbs_g numeric check (carbs_g >= 0), fat_g numeric check (fat_g >= 0), source text
);
create table if not exists public.body_metrics (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 measured_at date not null default current_date, weight_kg numeric check (weight_kg between 20 and 500), steps int check (steps >= 0), notes text,
 unique(user_id, measured_at)
);
alter table public.profiles enable row level security;
alter table public.workout_logs enable row level security;
alter table public.exercise_sets enable row level security;
alter table public.meal_logs enable row level security;
alter table public.body_metrics enable row level security;
create policy "profile owner only" on public.profiles for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "workout owner only" on public.workout_logs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "exercise owner only" on public.exercise_sets for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "meal owner only" on public.meal_logs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "metrics owner only" on public.body_metrics for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- One encrypted-in-transit JSON backup per authenticated user. RLS is mandatory.
create table if not exists public.app_state (
 user_id uuid primary key references auth.users(id) on delete cascade,
 app_state jsonb not null,
 updated_at timestamptz not null default now(),
 check (jsonb_typeof(app_state) = 'object')
);
alter table public.app_state enable row level security;
create policy "app state owner only" on public.app_state for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
grant select, insert, update, delete on public.app_state to authenticated;
