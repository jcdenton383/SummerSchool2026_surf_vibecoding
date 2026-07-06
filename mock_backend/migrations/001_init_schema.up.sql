create extension if not exists pgcrypto;

create table clients (
    id uuid primary key default gen_random_uuid(),
    phone text not null unique,
    name text,
    auth_status text not null default 'authenticated' check (auth_status = 'authenticated'),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table class_programs (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    direction text not null,
    difficulty text not null,
    menu text not null,
    default_duration_minutes integer not null check (default_duration_minutes > 0),
    required_equipment text,
    dish_image_url text
);

create table chefs (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    rating numeric(2,1) not null default 0 check (rating >= 0 and rating <= 5),
    rating_count integer not null default 0 check (rating_count >= 0)
);

create table schedule_slots (
    id uuid primary key default gen_random_uuid(),
    program_id uuid not null references class_programs(id),
    chef_id uuid not null references chefs(id),
    starts_at timestamptz not null,
    duration_minutes integer not null check (duration_minutes > 0),
    capacity integer not null check (capacity > 0),
    available_seats integer not null check (available_seats >= 0),
    seat_price_amount integer not null check (seat_price_amount >= 0),
    required_equipment_info text,
    rental_equipment_info text,
    rental_price_per_participant_amount integer not null default 0 check (rental_price_per_participant_amount >= 0),
    status text not null check (status in ('available', 'full', 'cancelled_by_studio', 'completed')),
    cancellation_reason text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint schedule_slots_available_capacity_check check (available_seats <= capacity)
);

create table bookings (
    id uuid primary key default gen_random_uuid(),
    client_id uuid not null references clients(id),
    slot_id uuid not null references schedule_slots(id),
    status text not null check (status in ('confirmed', 'offline_payment_pending', 'cancelled_by_client', 'cancelled_by_studio', 'completed')),
    participant_count integer not null check (participant_count >= 0),
    total_amount integer not null check (total_amount >= 0),
    payment_status text not null check (payment_status in ('not_required', 'pending_offline', 'paid_offline', 'refunded', 'refund_pending')),
    payment_method text not null check (payment_method in ('offline', 'online_placeholder')),
    payment_choice_status text not null check (payment_choice_status in ('selected', 'placeholder_shown', 'fallback_to_offline')),
    cancellable_until timestamptz not null,
    cancellation_reason text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table booking_participants (
    id uuid primary key default gen_random_uuid(),
    booking_id uuid not null references bookings(id),
    name text not null check (btrim(name) <> ''),
    is_primary boolean not null default false,
    status text not null check (status in ('active', 'cancelled_by_client', 'cancelled_by_studio')),
    allergy_status text not null check (allergy_status in ('none', 'has_allergy')),
    allergy_comment text,
    equipment_option text not null check (equipment_option in ('own', 'rental')),
    rental_price_snapshot integer not null default 0 check (rental_price_snapshot >= 0),
    created_at timestamptz not null default now(),
    constraint participant_allergy_comment_check check (
        allergy_status = 'none'
        or (allergy_status = 'has_allergy' and allergy_comment is not null and btrim(allergy_comment) <> '')
    )
);

create table chef_reviews (
    id uuid primary key default gen_random_uuid(),
    booking_id uuid not null unique references bookings(id),
    client_id uuid not null references clients(id),
    chef_id uuid not null references chefs(id),
    rating integer not null check (rating between 1 and 5),
    comment text,
    created_at timestamptz not null default now()
);

create table notifications (
    id uuid primary key default gen_random_uuid(),
    client_id uuid not null references clients(id),
    booking_id uuid references bookings(id),
    slot_id uuid references schedule_slots(id),
    type text not null check (type in ('class_reminder', 'studio_cancelled_class')),
    channel text not null check (channel in ('push', 'sms')),
    status text not null check (status in ('planned', 'sent', 'failed')),
    planned_at timestamptz not null,
    sent_at timestamptz,
    message text
);

create table legal_terms (
    id uuid primary key default gen_random_uuid(),
    version text not null,
    updated_at timestamptz not null default now(),
    cancellation_policy text not null,
    personal_data_policy text not null,
    terms text
);

create index schedule_slots_starts_at_idx on schedule_slots(starts_at);
create index bookings_client_id_idx on bookings(client_id);
create unique index bookings_active_client_slot_uidx
    on bookings(client_id, slot_id)
    where status in ('confirmed', 'offline_payment_pending');
create index booking_participants_booking_id_idx on booking_participants(booking_id);
create index notifications_client_id_idx on notifications(client_id);
