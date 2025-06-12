/*
  # Sample Data for Development

  1. Sample Projects
    - Creates a few example construction projects
    - Adds project memberships for authenticated users

  2. Sample Tasks
    - Creates example tasks for each project
    - Shows different statuses and priorities

  Note: This is optional sample data for development/testing
*/

-- Insert sample projects (only if no projects exist)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM projects LIMIT 1) THEN
    INSERT INTO projects (id, name, description, status, start_date, end_date, budget, address, client_name)
    VALUES 
      (
        gen_random_uuid(),
        'Downtown Office Complex',
        'Modern 15-story office building with retail space on ground floor',
        'active',
        '2024-01-15',
        '2025-06-30',
        2500000.00,
        '123 Main Street, Downtown',
        'Metro Development Corp'
      ),
      (
        gen_random_uuid(),
        'Residential Townhomes',
        'Luxury townhome development with 24 units',
        'planning',
        '2024-03-01',
        '2024-12-15',
        1800000.00,
        '456 Oak Avenue, Suburbs',
        'Green Living Properties'
      ),
      (
        gen_random_uuid(),
        'Bridge Renovation',
        'Historic bridge restoration and modernization',
        'active',
        '2024-02-01',
        '2024-08-30',
        950000.00,
        'River Crossing, Highway 101',
        'State Transportation Dept'
      );
  END IF;
END $$;

-- Function to add current user to all projects (for development)
CREATE OR REPLACE FUNCTION add_user_to_sample_projects()
RETURNS void AS $$
DECLARE
  project_record RECORD;
BEGIN
  -- Only run if user is authenticated
  IF auth.uid() IS NOT NULL THEN
    -- Add user to users table if not exists
    INSERT INTO users (id, email, full_name, role)
    VALUES (
      auth.uid(),
      COALESCE((SELECT email FROM auth.users WHERE id = auth.uid()), 'user@example.com'),
      COALESCE((SELECT raw_user_meta_data->>'full_name' FROM auth.users WHERE id = auth.uid()), 'Sample User'),
      'project_manager'
    )
    ON CONFLICT (id) DO NOTHING;

    -- Add user as owner to all sample projects
    FOR project_record IN SELECT id FROM projects LOOP
      INSERT INTO project_members (project_id, user_id, role)
      VALUES (project_record.id, auth.uid(), 'owner')
      ON CONFLICT (project_id, user_id) DO NOTHING;
      
      -- Update project owner
      UPDATE projects 
      SET owner_id = auth.uid() 
      WHERE id = project_record.id AND owner_id IS NULL;
    END LOOP;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION add_user_to_sample_projects() TO authenticated;