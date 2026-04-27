-- Revert User model to a simpler shape (only user_id, display_name, real_name,
-- profile_picture, last_updated). Uses IF EXISTS so it is safe to run against
-- databases that may not have all the columns added by previous migrations.

ALTER TABLE "User"
  DROP COLUMN IF EXISTS "pronouns",
  DROP COLUMN IF EXISTS "title",
  DROP COLUMN IF EXISTS "phone",
  DROP COLUMN IF EXISTS "location",
  DROP COLUMN IF EXISTS "school",
  DROP COLUMN IF EXISTS "birthday",
  DROP COLUMN IF EXISTS "manager",
  DROP COLUMN IF EXISTS "website_url",
  DROP COLUMN IF EXISTS "website_url_alt",
  DROP COLUMN IF EXISTS "scrapbook_url",
  DROP COLUMN IF EXISTS "scrapbook_url_alt",
  DROP COLUMN IF EXISTS "github_url",
  DROP COLUMN IF EXISTS "github_url_alt",
  DROP COLUMN IF EXISTS "ham_callsign",
  DROP COLUMN IF EXISTS "matrix_username",
  DROP COLUMN IF EXISTS "bluesky_url",
  DROP COLUMN IF EXISTS "bluesky_url_alt",
  DROP COLUMN IF EXISTS "social_account_url",
  DROP COLUMN IF EXISTS "social_account_url_alt",
  DROP COLUMN IF EXISTS "favorite_channels",
  DROP COLUMN IF EXISTS "favorite_foods",
  DROP COLUMN IF EXISTS "favorite_artists",
  DROP COLUMN IF EXISTS "favorite_activities",
  DROP COLUMN IF EXISTS "favorite_tools",
  DROP COLUMN IF EXISTS "dog_cat_infra",
  DROP COLUMN IF EXISTS "pfp_credit",
  DROP COLUMN IF EXISTS "gold_since",
  DROP COLUMN IF EXISTS "club_rank";

-- Align last_updated default with the schema's representation
-- ('1969-12-31 16:00:00-08' is the same instant as '1970-01-01 00:00:00+00')
ALTER TABLE "User"
  ALTER COLUMN "last_updated" SET DEFAULT '1969-12-31 16:00:00-08'::timestamptz;
