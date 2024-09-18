# Function to check if a command exists
function Test-Command($cmdname) {
    return $null -ne (Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Function to install Node.js
function Install-NodeJS {
    Write-Host "Node.js is not installed. Installing Node.js..."
    $nodeUrl = "https://nodejs.org/dist/v20.15.1/node-v20.15.1-x64.msi"
    $installer = "node_installer.msi"
    Invoke-WebRequest -Uri $nodeUrl -OutFile $installer
    Start-Process msiexec.exe -ArgumentList "/i $installer /qn" -Wait
    Remove-Item $installer
    Write-Host "Node.js has been installed successfully."
}

# Function to get user input with validation
function Get-ValidatedInput($prompt, $validationScript) {
    do {
        $value = Read-Host -Prompt $prompt
        $isValid = & $validationScript $value
        if (-not $isValid) {
            Write-Host "Invalid input. Please try again."
        }
    } while (-not $isValid)
    return $value
}

# Validation functions
$validateEmail = {
    param($email)
    $email -match "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
}

$validatePhone = {
    param($phone)
    $phone -match "^\d{10}$"
}

$validateZip = {
    param($zip)
    $zip -match "^\d{5}(-\d{4})?$"
}

# Main script
Write-Host "Starting setup process..."

# Check if Node.js is installed, install if not
if (-not (Test-Command "node")) {
    Install-NodeJS
} else {
    Write-Host "Node.js is already installed."
}

# Check Node.js version
$nodeVersion = node -v
Write-Host "Using Node.js version: $nodeVersion"

# Install dependencies
Write-Host "Installing dependencies..."
npm install

# Create .env file
$answer = Read-Host "Do you want to use the default .env (config) file? (yes/no)"
if ($answer -eq "yes" -or $answer -eq "y") {
    $env:FIRST_NAME = Get-ValidatedInput "Enter your first name: " { $true }
    $env:LAST_NAME = Get-ValidatedInput "Enter your last name: " { $true }
    $env:ADDRESS = Get-ValidatedInput "Enter your address: " { $true }
    $env:CITY = Get-ValidatedInput "Enter your city: " { $true }
    $env:ZIP_CODE = Get-ValidatedInput "Enter your zip code: " $validateZip
    $env:PHONE = Get-ValidatedInput "Enter your phone number (10 digits, no dashes): " $validatePhone
    $env:PASSWORD = Get-ValidatedInput "Enter your password: " { $true }
    $env:CATCHALL = Get-ValidatedInput "Enter your catchall email domain: " { $true }
    $env:EMAIL = Get-ValidatedInput "Enter your primary email: " $validateEmail

    Write-Host "To get your Google Client ID, Client Secret, and Redirect URI, please follow these steps:"
    Write-Host "1. Visit https://console.developers.google.com"
    Write-Host "2. Enable Gmail API and OAuth consent: https://console.cloud.google.com/marketplace/product/google/gmail.googleapis.com"
    Write-Host "3. Go to the Google Cloud Console and navigate to the API Library page."
    Write-Host "4. Search for 'Gmail API' and enable it."
    Write-Host "5. Set up the OAuth consent screen (select 'External')."
    Write-Host "6. Create credentials: OAuth client ID for Web application."
    Write-Host "7. Set the Authorized Redirect URI to: http://localhost:3000"
    Write-Host "8. Copy the Client ID, Client Secret, and Redirect URI."

    $env:CLIENT_ID = Get-ValidatedInput "Enter your Google Client ID: " { $true }
    $env:CLIENT_SECRET = Get-ValidatedInput "Enter your Google Client Secret: " { $true }
    $env:REDIRECT_URI = Get-ValidatedInput "Enter your Google Redirect URI: " { $true }

    $envContent = @"
PASSWORD=$env:PASSWORD
FIRST_NAME=$env:FIRST_NAME
LAST_NAME=$env:LAST_NAME
ADDRESS=$env:ADDRESS
CITY=$env:CITY
ZIP_CODE=$env:ZIP_CODE
PHONE=$env:PHONE
CATCHALL=@$env:CATCHALL
EMAIL=$env:EMAIL
# Google OAuth
CLIENT_ID=$env:CLIENT_ID
CLIENT_SECRET=$env:CLIENT_SECRET
REDIRECT_URIS=$env:REDIRECT_URI
"@

    $envContent | Out-File -FilePath ".env" -Encoding ASCII
    Write-Host ".env file created successfully."
} else {
    Write-Host "Please create your own .env file."
}

# Create directories if necessary
New-Item -ItemType Directory -Force -Path "src\screenshots", "src\gmail-tester" | Out-Null

Write-Host "After completing the OAuth signup process:"
Write-Host "1. Download the credentials file."
Write-Host "2. Rename it to 'credentials.json'"
Write-Host "3. Move it to the 'src\gmail-tester' folder."

while (-not (Test-Path "src\gmail-tester\credentials.json")) {
    Write-Host "credentials.json not found in the src\gmail-tester folder. Please add it before proceeding."
    Start-Sleep -Seconds 5
}

Write-Host "Running generate-token script..."
Write-Host "Please follow the instructions in the new window that will open."
Write-Host "After you've authorized the application, you'll be redirected to a URL."
Write-Host "Copy the code from that URL (between 'code=' and '&')."
Write-Host "Press Enter when you're ready to proceed."
Read-Host

Start-Process powershell -ArgumentList "-NoExit", "-Command", "npx ts-node src/modules/generate-token.ts" -Wait

$AUTH_CODE = Get-ValidatedInput "Paste the code from the URL here: " { $true }

Write-Host "Auth code received. Proceeding with authentication..."
node node_modules/gmail-tester/init.js ./src/gmail-tester/credentials.json ./src/gmail-tester/token.json $env:EMAIL

Write-Host "Authentication process completed."
Write-Host "Waiting for 5 seconds before continuing..."
Start-Sleep -Seconds 5

# Start the application
Write-Host "Starting the application..."
npm run dev

Write-Host "Script execution completed."
Read-Host "Press Enter to exit"