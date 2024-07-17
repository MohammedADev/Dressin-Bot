@echo off
setlocal enabledelayedexpansion

:: Function to check if a command exists
:command_exists
where %1 >nul 2>nul
if %errorlevel% equ 0 (
    exit /b 0
) else (
    exit /b 1
)

:: Function to install Node.js
:install_node
echo Node.js is not installed. Installing Node.js...
powershell -Command "Invoke-WebRequest https://nodejs.org/dist/v18.16.0/node-v18.16.0-x64.msi -OutFile node_installer.msi"
msiexec /i node_installer.msi /qn
del node_installer.msi
echo Node.js has been installed successfully.
exit /b 0

:: Check if Node.js is installed, install if not
call :command_exists node
if %errorlevel% neq 0 (
    call :install_node
) else (
    echo Node.js is already installed.
)

:: Check Node.js version
for /f "tokens=*" %%i in ('node -v') do set node_version=%%i
echo Using Node.js version: %node_version%

:: Install dependencies
npm install

:: Function to get user input with validation
:get_input
set "prompt=%~1"
set "var_name=%~2"
set "validate_func=%~3"
:input_loop
set /p "value=%prompt%"
if defined validate_func (
    call :%validate_func% "!value!"
    if !errorlevel! equ 0 (
        set "%var_name%=!value!"
        exit /b 0
    ) else (
        echo Invalid input. Please try again.
        goto input_loop
    )
) else (
    set "%var_name%=!value!"
    exit /b 0
)

:: Validation functions
:validate_email
echo %~1 | findstr /r "^[a-zA-Z0-9._%+-]\+@[a-zA-Z0-9.-]\+\.[a-zA-Z]\{2,\}$" >nul
if %errorlevel% equ 0 (exit /b 0) else (exit /b 1)

:validate_phone
echo %~1 | findstr /r "^[0-9]\{10\}$" >nul
if %errorlevel% equ 0 (exit /b 0) else (exit /b 1)

:validate_zip
echo %~1 | findstr /r "^[0-9]\{5\}\(-[0-9]\{4\}\)\?$" >nul
if %errorlevel% equ 0 (exit /b 0) else (exit /b 1)

:: Create .env file
set /p answer="Do you want to use the default .env (config) file? (yes/no): "
if /i "%answer%" equ "yes" (
    call :get_input "Enter your first name: " FIRST_NAME
    call :get_input "Enter your last name: " LAST_NAME
    call :get_input "Enter your address: " ADDRESS
    call :get_input "Enter your city: " CITY
    call :get_input "Enter your zip code: " ZIP_CODE validate_zip
    call :get_input "Enter your phone number (10 digits, no dashes): " PHONE validate_phone
    call :get_input "Enter your password: " PASSWORD
    call :get_input "Enter your catchall email domain: " CATCHALL
    call :get_input "Enter your primary email: " EMAIL validate_email

    echo To get your Google Client ID, Client Secret, and Redirect URI, please follow these steps:
    echo 1. Visit https://console.developers.google.com
    echo 2. Enable Gmail API and OAuth consent: https://console.cloud.google.com/marketplace/product/google/gmail.googleapis.com
    echo 3. Go to the Google Cloud Console and navigate to the API Library page.
    echo 4. Search for 'Gmail API' and enable it.
    echo 5. Set up the OAuth consent screen (select 'External').
    echo 6. Create credentials: OAuth client ID for Web application.
    echo 7. Set the Authorized Redirect URI to: http://localhost:3000
    echo 8. Copy the Client ID, Client Secret, and Redirect URI.

    call :get_input "Enter your Google Client ID: " CLIENT_ID
    call :get_input "Enter your Google Client Secret: " CLIENT_SECRET
    call :get_input "Enter your Google Redirect URI: " REDIRECT_URI

    (
        echo PASSWORD=!PASSWORD!
        echo FIRST_NAME=!FIRST_NAME!
        echo LAST_NAME=!LAST_NAME!
        echo ADDRESS=!ADDRESS!
        echo CITY=!CITY!
        echo ZIP_CODE=!ZIP_CODE!
        echo PHONE=!PHONE!
        echo CATCHALL=@!CATCHALL!
        echo EMAIL=!EMAIL!
        echo # Google OAuth
        echo CLIENT_ID=!CLIENT_ID!
        echo CLIENT_SECRET=!CLIENT_SECRET!
        echo REDIRECT_URIS=!REDIRECT_URI!
    ) > .env
    echo .env file created successfully.
) else (
    echo Please create your own .env file.
)

echo After completing the OAuth signup process:
echo 1. Download the credentials file.
echo 2. Rename it to 'credentials.json'
echo 3. Move it to the 'gmail-tester' folder.

if exist "gmail-tester\credentials.json" (
    npx ts-node src/modules/generate-token.ts

    echo After authorizing your Google account, you'll be redirected to a URL.
    echo Copy the code from the URL (between 'code=' and '&').
    
    call :get_input "Paste the code from the URL here: " AUTH_CODE
    
    echo Auth code received. Proceeding with authentication...
    node node_modules/gmail-tester/init.js ./src/gmail-tester/credentials.json ./src/gmail-tester/token.json "!EMAIL!"
    
    echo Waiting for 5 seconds before attempting to stop the process...
    echo Press Ctrl+C to stop the process if it doesn't stop automatically.
    timeout /t 5
    
    pause
) else (
    echo credentials.json not found in the gmail-tester folder. Please add it before proceeding.
)

:: Start the application
npm run dev

endlocal