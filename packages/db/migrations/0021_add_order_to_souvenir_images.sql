-- Add primary key id and ordering to souvenir_images for sortable image management
DO $$ BEGIN
  -- Add id column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'souvenir_images' AND column_name = 'id'
  ) THEN
    ALTER TABLE "souvenir_images" ADD COLUMN "id" serial PRIMARY KEY;
  END IF;

  -- Add order column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'souvenir_images' AND column_name = 'order'
  ) THEN
    ALTER TABLE "souvenir_images" ADD COLUMN "order" integer NOT NULL DEFAULT 0;
  END IF;
END $$;
