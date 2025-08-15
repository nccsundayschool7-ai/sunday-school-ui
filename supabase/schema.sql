-- Enable UUID generation
create extension if not exists pgcrypto;

-- Enums
do $$ begin
  create type leader_role as enum ('teacher','assistant_teacher','support_staff');
exception when duplicate_object then null; end $$;

do $$ begin
  create type person_type as enum ('student','leader');
exception when duplicate_object then null; end $$;

do $$ begin
  create type attendance_status as enum ('present','absent','late','excused');
exception when duplicate_object then null; end $$;

-- Leaders
create table if not exists leaders (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id),
  first_name text not null,
  last_name text not null,
  role leader_role not null,
  phone text,
  email text,
  is_admin boolean not null default false,
  notes text,
  inserted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Students
create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  first_name text not null,
  last_name text not null,
  date_of_birth date,
  group_name text,
  grade text,
  class text,
  photo_url text,
  teacher_id uuid references leaders(id),
  assistant_teacher_id uuid references leaders(id),
  guardian_name text,
  guardian_phone text,
  mother_name text,
  mother_phone text,
  father_name text,
  father_phone text,
  notes text,
  inserted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Attendance
create table if not exists attendance (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  person_id uuid not null,
  type person_type not null,
  status attendance_status not null,
  remarks text,
  inserted_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (date, person_id)
);

-- Indexes
create index if not exists idx_attendance_person_date on attendance (person_id, date);
create index if not exists idx_attendance_date on attendance (date);
create index if not exists idx_students_teacher on students (teacher_id);
create index if not exists idx_students_group on students (group_name);
create index if not exists idx_leaders_role on leaders (role);

-- Attendance summary view
create or replace view v_attendance_summary as
select
  person_id,
  type,
  count(*) filter (where status in ('present','absent','late')) as counted_days,
  count(*) filter (where status = 'present') as present_days,
  count(*) filter (where status = 'late') as late_days,
  round(
    case when count(*) filter (where status in ('present','absent','late')) = 0
      then null
      else 100.0 * count(*) filter (where status = 'present')
           / count(*) filter (where status in ('present','absent','late'))
    end
  , 1) as attendance_pct
from attendance
group by person_id, type;

-- Date-range percentage function
create or replace function attendance_percent(_person uuid, _from date, _to date)
returns numeric language sql stable as $$
  select round(
    case when count(*) filter (where status in ('present','absent','late')) = 0
      then null
      else 100.0 * count(*) filter (where status = 'present')
           / count(*) filter (where status in ('present','absent','late'))
    end
  , 1)
  from attendance
  where person_id = _person
    and date between _from and _to;
$$;

-- RLS
alter table leaders enable row level security;
alter table students enable row level security;
alter table attendance enable row level security;

-- Policies
create policy if not exists leaders_select on leaders for select using (auth.role() = 'authenticated');
create policy if not exists leaders_insert on leaders for insert with check (exists (select 1 from leaders l where l.auth_user_id = auth.uid() and l.is_admin));
create policy if not exists leaders_update on leaders for update using (
  exists (select 1 from leaders l where l.auth_user_id = auth.uid() and (l.is_admin or l.id = leaders.id))
) with check (true);
create policy if not exists leaders_delete on leaders for delete using (exists (select 1 from leaders l where l.auth_user_id = auth.uid() and l.is_admin));

create policy if not exists students_select on students for select using (auth.role() = 'authenticated');
create policy if not exists students_write on students for all using (exists (select 1 from leaders l where l.auth_user_id = auth.uid() and l.is_admin)) with check (exists (select 1 from leaders l where l.auth_user_id = auth.uid() and l.is_admin));

create policy if not exists attendance_select on attendance for select using (auth.role() = 'authenticated');
create policy if not exists attendance_insert on attendance for insert with check (exists (select 1 from leaders l where l.auth_user_id = auth.uid()));
create policy if not exists attendance_update on attendance for update using (exists (select 1 from leaders l where l.auth_user_id = auth.uid())) with check (exists (select 1 from leaders l where l.auth_user_id = auth.uid()));
create policy if not exists attendance_delete on attendance for delete using (exists (select 1 from leaders l where l.auth_user_id = auth.uid() and l.is_admin)); 

create or replace view v_attendance_students as
select a.date, a.person_id, a.type, a.status, s.slug, s.first_name, s.last_name
from attendance a
join students s on s.id = a.person_id; 