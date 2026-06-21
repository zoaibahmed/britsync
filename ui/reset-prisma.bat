@echo off
echo Stopping all Node.js processes...
taskkill /F /IM node.exe
timeout /t 2 /nobreak >nul

echo Removing Prisma directories...
rmdir /s /q node_modules\.prisma
rmdir /s /q node_modules\@prisma
rmdir /s /q .next

echo Installing specific Prisma version...
call npm install prisma@5.19.0 @prisma/client@5.19.0 --save-exact

echo Generating Prisma Client...
call npx prisma generate

echo Done. You may now run 'npm run dev'.
pause
