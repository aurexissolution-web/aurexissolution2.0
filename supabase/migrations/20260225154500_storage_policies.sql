-- Ensure bucket exists and is public
insert into storage.buckets (id, name, public)
values ('Aurexis Solution', 'Aurexis Solution', true)
on conflict (id) do update set public = true;

-- Public read for this bucket
create policy "Public read Aurexis Solution" on storage.objects
for select
using (bucket_id = 'Aurexis Solution');

-- Allow authenticated users to upload to this bucket
create policy "Authenticated upload Aurexis Solution" on storage.objects
for insert
to authenticated
with check (bucket_id = 'Aurexis Solution');

-- Allow authenticated users to update their objects in this bucket
create policy "Authenticated update Aurexis Solution" on storage.objects
for update
to authenticated
using (bucket_id = 'Aurexis Solution')
with check (bucket_id = 'Aurexis Solution');

-- Allow authenticated users to delete their objects in this bucket
create policy "Authenticated delete Aurexis Solution" on storage.objects
for delete
to authenticated
using (bucket_id = 'Aurexis Solution');
