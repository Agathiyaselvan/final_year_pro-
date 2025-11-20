@echo off
echo Starting Post-Quantum FIDO2 Backend...
echo.
echo Building and starting Spring Boot application...
mvn clean install
mvn spring-boot:run
pause
