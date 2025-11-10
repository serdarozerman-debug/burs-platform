-- Add has_api_integration column to scholarships table
ALTER TABLE scholarships
ADD COLUMN IF NOT EXISTS has_api_integration BOOLEAN DEFAULT FALSE;

-- Update existing records to have has_api_integration = false
UPDATE scholarships
SET has_api_integration = FALSE
WHERE has_api_integration IS NULL;

-- Optional: Set specific organizations to have API integration (example)
-- UPDATE scholarships
-- SET has_api_integration = TRUE
-- WHERE organization = 'TÜBİTAK' AND title LIKE '%2209-A%';

-- Verify the changes
SELECT 
  title, 
  organization, 
  has_api_integration, 
  application_url
FROM scholarships
LIMIT 10;

