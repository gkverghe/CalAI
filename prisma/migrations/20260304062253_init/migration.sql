-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dailyCalGoal" INTEGER NOT NULL DEFAULT 2000,
    "dailyProteinG" INTEGER NOT NULL DEFAULT 150,
    "dailyCarbsG" INTEGER NOT NULL DEFAULT 250,
    "dailyFatG" INTEGER NOT NULL DEFAULT 65,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meal" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "loggedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category" TEXT NOT NULL,
    "photoPath" TEXT,
    "notes" TEXT,
    "totalCals" INTEGER NOT NULL DEFAULT 0,
    "totalProteinG" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalCarbsG" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalFatG" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Meal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FoodItem" (
    "id" TEXT NOT NULL,
    "mealId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" TEXT NOT NULL,
    "calories" INTEGER NOT NULL,
    "proteinG" DOUBLE PRECISION NOT NULL,
    "carbsG" DOUBLE PRECISION NOT NULL,
    "fatG" DOUBLE PRECISION NOT NULL,
    "confidence" DOUBLE PRECISION,

    CONSTRAINT "FoodItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Meal_userId_loggedAt_idx" ON "Meal"("userId", "loggedAt");

-- CreateIndex
CREATE INDEX "FoodItem_mealId_idx" ON "FoodItem"("mealId");

-- AddForeignKey
ALTER TABLE "Meal" ADD CONSTRAINT "Meal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodItem" ADD CONSTRAINT "FoodItem_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
