@echo off
cd /d D:\User\Workspace\ai_services_website\server

echo ==================================== >> postScheduler.log
echo [%date% %time%] Running postScheduler >> postScheduler.log

call npm run postScheduler >> postScheduler.log 2>&1

echo [%date% %time%] Finished run >> postScheduler.log
