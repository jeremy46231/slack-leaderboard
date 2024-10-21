-- CreateTable
CREATE TABLE "Day" (
    "date" DATE NOT NULL,
    "user_day_loaded" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Day_pkey" PRIMARY KEY ("date")
);

-- CreateTable
CREATE TABLE "UserDay" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "is_desktop" BOOLEAN NOT NULL,
    "is_ios" BOOLEAN NOT NULL,
    "is_android" BOOLEAN NOT NULL,
    "messages_posted" INTEGER NOT NULL,
    "messages_posted_in_channel" INTEGER NOT NULL,
    "reactions_added" INTEGER NOT NULL,

    CONSTRAINT "UserDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "user_id" TEXT NOT NULL,
    "display_name" TEXT,
    "real_name" TEXT,
    "profile_picture" TEXT,
    "pronouns" TEXT,
    "title" TEXT,
    "phone" TEXT,
    "location" TEXT,
    "school" TEXT,
    "birthday" TEXT,
    "website_url" TEXT,
    "scrapbook_url" TEXT,
    "github_url" TEXT,
    "ham_callsign" TEXT,
    "matrix_username" TEXT,
    "favorite_channels" TEXT,
    "favorite_foods" TEXT,
    "favorite_artists" TEXT,
    "favorite_activities" TEXT,
    "favorite_tools" TEXT,
    "dog_cat_infra" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE INDEX "UserDay_user_id_idx" ON "UserDay"("user_id");

-- AddForeignKey
ALTER TABLE "UserDay" ADD CONSTRAINT "UserDay_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDay" ADD CONSTRAINT "UserDay_date_fkey" FOREIGN KEY ("date") REFERENCES "Day"("date") ON DELETE RESTRICT ON UPDATE CASCADE;
