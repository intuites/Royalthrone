create table movie_cast (
  id uuid default gen_random_uuid() primary key,
  movie_id uuid references movies(id) on delete cascade,
  name text,
  role text,
  photo_url text
);

create table movie_crew (
  id uuid default gen_random_uuid() primary key,
  movie_id uuid references movies(id) on delete cascade,
  name text,
  job text,
  photo_url text
);

create table movie_director (
  id uuid default gen_random_uuid() primary key,
  movie_id uuid references movies(id) on delete cascade,
  name text,
  photo_url text
);

create table movie_music (
  id uuid default gen_random_uuid() primary key,
  movie_id uuid references movies(id) on delete cascade,
  name text,
  photo_url text
);

create table movie_production (
  id uuid default gen_random_uuid() primary key,
  movie_id uuid references movies(id) on delete cascade,
  name text,
  role text
);

create table movie_photos (
  id uuid default gen_random_uuid() primary key,
  movie_id uuid references movies(id) on delete cascade,
  image_url text
);

-- pitch submission form here
create table pitch_submissions (
  id uuid primary key default uuid_generate_v4(),
  first_name text,
  last_name text,
  phone text,
  email text,
  experience text,
  swa_title text,
  swa_number text,
  swa_date date,
  story_title text,
  genre text,
  film_type text,
  logline text,
  synopsis text,
  created_at timestamp default now()
);
