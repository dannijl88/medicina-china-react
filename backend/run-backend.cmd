@echo off
set "JAVA_HOME=C:\Program Files\Java\jdk-25"
set "PATH=%JAVA_HOME%\bin;%PATH%"
if "%DB_URL%"=="" set "DB_URL=jdbc:mysql://localhost:3306/medicina_china?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Europe/Madrid"
if "%DB_USERNAME%"=="" set "DB_USERNAME=root"
if "%DB_PASSWORD%"=="" set "DB_PASSWORD=sasa"
call "%~dp0mvnw.cmd" spring-boot:run
