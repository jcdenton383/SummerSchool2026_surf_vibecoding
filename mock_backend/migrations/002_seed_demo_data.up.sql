insert into clients (id, phone, name, auth_status)
values
('00000000-0000-0000-0000-000000000001', '+79991234567', 'Анна', 'authenticated');

insert into class_programs (id, title, direction, difficulty, menu, default_duration_minutes, required_equipment, dish_image_url)
values
('10000000-0000-0000-0000-000000000001', 'SERVER: паста и равиоли', 'Серверная Италия', 'beginner', 'Равиоли, томатный соус, тирамису', 150, 'Фартук и удобная обувь', 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1200&q=80'),
('10000000-0000-0000-0000-000000000002', 'SERVER: вок и димсамы', 'Серверная Азия', 'medium', 'Димсамы, вок, соус чили', 180, 'Фартук', 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=1200&q=80'),
('10000000-0000-0000-0000-000000000003', 'SERVER: тарталетки и меренга', 'Серверная Франция', 'advanced', 'Тарталетки, меренга, лимонный крем', 180, 'Фартук', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80');

insert into chefs (id, name, rating, rating_count)
values
('20000000-0000-0000-0000-000000000001', 'SERVER Шеф Нина', 4.8, 42),
('20000000-0000-0000-0000-000000000002', 'SERVER Шеф Тимур', 4.7, 31),
('20000000-0000-0000-0000-000000000003', 'SERVER Шеф Алиса', 4.9, 27);

insert into schedule_slots (id, program_id, chef_id, starts_at, duration_minutes, capacity, available_seats, seat_price_amount, required_equipment_info, rental_equipment_info, rental_price_per_participant_amount, status, cancellation_reason)
values
('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', now() + interval '2 days', 150, 10, 8, 3500, 'Можно прийти со своим фартуком.', 'Прокат фартука и базового набора.', 400, 'available', null),
('30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', now() + interval '3 days', 180, 6, 1, 4200, 'Нужна удобная обувь.', 'Прокат набора.', 500, 'available', null),
('30000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000003', now() + interval '4 days', 180, 8, 0, 4800, null, 'Прокат фартука.', 400, 'full', null),
('30000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', now() + interval '5 days', 180, 8, 8, 4200, null, 'Прокат набора.', 500, 'cancelled_by_studio', 'Шеф заболел, занятие перенесено.'),
('30000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', now() + interval '6 days', 150, 10, 10, 3500, null, 'Прокат фартука.', 400, 'cancelled_by_studio', null),
('30000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000003', now() - interval '2 days', 180, 8, 6, 4800, null, 'Прокат фартука.', 400, 'completed', null),
('30000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', now() + interval '10 days', 150, 10, 10, 3500, null, 'Прокат фартука.', 400, 'available', null);

insert into bookings (id, client_id, slot_id, status, participant_count, total_amount, payment_status, payment_method, payment_choice_status, cancellable_until, cancellation_reason)
values
('40000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'confirmed', 1, 3500, 'pending_offline', 'offline', 'selected', (select starts_at - interval '24 hours' from schedule_slots where id = '30000000-0000-0000-0000-000000000001'), null),
('40000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000002', 'offline_payment_pending', 2, 8900, 'pending_offline', 'online_placeholder', 'placeholder_shown', (select starts_at - interval '24 hours' from schedule_slots where id = '30000000-0000-0000-0000-000000000002'), null),
('40000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000004', 'cancelled_by_studio', 1, 4200, 'refund_pending', 'offline', 'selected', (select starts_at - interval '24 hours' from schedule_slots where id = '30000000-0000-0000-0000-000000000004'), 'Шеф заболел, занятие перенесено.'),
('40000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000006', 'completed', 1, 4800, 'paid_offline', 'offline', 'selected', (select starts_at - interval '24 hours' from schedule_slots where id = '30000000-0000-0000-0000-000000000006'), null),
('40000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000006', 'completed', 1, 5200, 'paid_offline', 'offline', 'selected', (select starts_at - interval '24 hours' from schedule_slots where id = '30000000-0000-0000-0000-000000000006'), null);

insert into booking_participants (booking_id, name, is_primary, status, allergy_status, allergy_comment, equipment_option, rental_price_snapshot)
values
('40000000-0000-0000-0000-000000000001', 'Анна', true, 'active', 'none', null, 'own', 0),
('40000000-0000-0000-0000-000000000002', 'Анна', true, 'active', 'none', null, 'own', 0),
('40000000-0000-0000-0000-000000000002', 'Павел', false, 'active', 'has_allergy', 'Орехи', 'rental', 500),
('40000000-0000-0000-0000-000000000003', 'Анна', true, 'cancelled_by_studio', 'none', null, 'own', 0),
('40000000-0000-0000-0000-000000000004', 'Анна', true, 'active', 'none', null, 'own', 0),
('40000000-0000-0000-0000-000000000005', 'Анна', true, 'active', 'none', null, 'rental', 400);

insert into chef_reviews (id, booking_id, client_id, chef_id, rating, comment)
values
('50000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000003', 5, 'Понятно и вкусно.');

insert into notifications (client_id, booking_id, slot_id, type, channel, status, planned_at, sent_at, message)
values
('00000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'class_reminder', 'push', 'planned', now() + interval '1 day', null, 'Завтра кулинарный класс. Не забудьте свой инвентарь, если выбрали его.'),
('00000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000004', 'studio_cancelled_class', 'sms', 'sent', now(), now(), 'Класс отменён студией. Причина доступна в деталях брони.');

insert into legal_terms (version, cancellation_policy, personal_data_policy, terms)
values
('2026-07-05', 'Клиент может отменить бронь не позднее чем за 24 часа до начала класса.', 'Персональные данные используются только для записи на класс и связи по брони.', 'Оплата в MVP происходит вне приложения: наличными в студии или переводом на карту по правилам студии.');
