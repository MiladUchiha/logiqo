/*
  # Storage Buckets Setup

  1. Storage Buckets
    - documents: For project documents and files
    - avatars: For user profile pictures

  2. Storage Policies
    - Project members can upload/view documents
    - Users can manage their own avatars
*/

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('documents', 'documents', false),
  ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for documents bucket
CREATE POLICY "Project members can view documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'documents' AND
    (storage.foldername(name))[1] IN (
      SELECT project_id::text FROM project_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Project members can upload documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'documents' AND
    (storage.foldername(name))[1] IN (
      SELECT project_id::text FROM project_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Project members can update documents" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'documents' AND
    (storage.foldername(name))[1] IN (
      SELECT project_id::text FROM project_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Project members can delete documents" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'documents' AND
    (storage.foldername(name))[1] IN (
      SELECT project_id::text FROM project_members 
      WHERE user_id = auth.uid()
    )
  );

-- Storage policies for avatars bucket
CREATE POLICY "Users can view all avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update own avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own avatar" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );