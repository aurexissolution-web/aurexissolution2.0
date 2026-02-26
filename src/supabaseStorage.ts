import { supabase } from './supabaseClient';

type UploadOptions = {
  bucket: string;
  folder?: string;
};

const sanitizeSegment = (value: string) => value.replace(/[^a-z0-9._/-]/gi, '-');

export const uploadPublicImage = async (file: File, options: UploadOptions) => {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please set up your .env file.');
  }

  if (!options.bucket) {
    throw new Error('Supabase storage bucket is not configured.');
  }

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'png';
  const safeExt = ext.replace(/[^a-z0-9]/g, '') || 'png';
  const filename = `${crypto.randomUUID()}.${safeExt}`;
  const folder = options.folder?.replace(/^\/+|\/+$/g, '') ?? 'uploads';
  const path = `${sanitizeSegment(folder)}/${filename}`;

  const { error } = await supabase.storage.from(options.bucket).upload(path, file, {
    contentType: file.type || 'application/octet-stream',
    upsert: false
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from(options.bucket).getPublicUrl(path);
  if (!data?.publicUrl) {
    throw new Error('Unable to resolve public URL for uploaded file.');
  }

  return data.publicUrl;
};
