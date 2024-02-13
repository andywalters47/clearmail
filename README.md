# clearmail README

## Introduction

**clearmail** is an open-source project that leverages AI to filter emails according to a set of simple rules you can write in english. The tool stars important emails and rejects or categorizes non-important emails according to preferences you can easily specify.

For maximum peace of mind, clearmail does not delete any emails. Instead, it only adds or removes labels from them, allowing you to review the AI's work. This project began as a weekend project and is still very much a work in progress!

## How it works

### 1. At a Given Interval...

Clearmail operates on a configurable interval, determined by the `refreshInterval` setting in the `config.yml` file. This interval sets how often clearmail checks for new emails. When running in script mode, the process wakes up at this interval, checks for new emails since the last processed timestamp, and then goes back to sleep until the next interval.

### 2. Connecting to the Gmail via IMAP

Clearmail uses the IMAP protocol to connect to your Gmail account. It securely authenticates using the credentials provided in the `.env` file and establishes a connection to the server.

### 3. Searching for New Emails

Once connected, clearmail searches the inbox for any unread emails that have arrived since the last processed timestamp that are not STARRED.

### 4. Processing Each Email

For each new email identified, clearmail performs the following steps:

- **Analyzing the Email:** The email's sender, subject, and body is analyzed using either the local LLM or OpenAI to determine if the email should be kept/starred or rejected/sorted according to predefined rules you specify in plain english in the `config.yml` file.

#### Sample Rules for Keeping Emails

```yaml
rules:
  keep: |
    * Email is a direct reply to one of my sent emails
    * Email contains tracking information for a recent purchase
    * Subject: "Invoice" or "Receipt" (Transactional emails)
```

#### Example Rules for Rejecting Emails

```yaml
rules:
  reject: |
    * Bulk emails that are not addressed to me specifically by name
    * Subject contains "Subscribe" or "Join now"
    * Email looks like a promotion
```

- **Categorizing or Moving the Email:** If the email is worth reading according to your rules, it is left in the inbox and starred.  If it's not, its either:
    - Moved to the rejection folder (as named in `rejectedFolderName`), if the email is considered not important.
    - Moved to a specific label like `Social`, if `sortIntoCategoryFolders` is enabled and the email matches one of the specified categories.  You can specify any categories you want!  For example:

        ```yaml
        categoryFolderNames:
          - News
          - Social Updates
          - Work
          - Family
          - Financial
        ```

### 5. Wrap Up

If any errors occur during the process, such as connection issues or errors in email analysis, clearmail logs these errors for debugging purposes.

## Requirements

To use clearmail you will need:

- A Gmail account
- Node.js installed on your system

Note: this has only been tested for Mac.

## Setup Instructions

Follow these steps to get clearmail up and running on your system:

### Step 1: Gmail IMAP Access with App Password

To securely access your Gmail account using IMAP in applications like clearmail, especially when you have 2-Step Verification enabled, you'll need to create and use an app password. An app password is a 16-character code that allows less secure apps to access your Google Account. Here's a detailed guide on how to create and use app passwords for Gmail IMAP access:

#### Prerequisites
- **2-Step Verification:** To create an app password, your Google Account must have 2-Step Verification enabled. This adds an additional layer of security to your account by requiring a second verification step during sign-in.

#### Creating an App Password

1. **Go to Your Google Account:**
    - Navigate to [Google Account settings](https://myaccount.google.com/).

2. **Select Security:**
    - Find the "Security" tab on the left-hand side and click on it to access your security settings.

3. **Access 2-Step Verification Settings:**
    - Under the "Signing in to Google" section, find and select "2-Step Verification." You may need to sign in to your account again for security purposes.

4. **Open App Passwords Page:**
    - Scroll down to the bottom of the 2-Step Verification page, and you should see the "App passwords" option. Click on it to proceed.
    - If you do not see this option, ensure that 2-Step Verification is indeed enabled and not set up exclusively for security keys. Note that app passwords may not be available for accounts managed by work, school, or other organizations, or for accounts with Advanced Protection enabled.

5. **Generate a New App Password:**
    - Click on "Select app" and choose "Mail" as the application you want to generate the password for.
    - Choose the device you are generating the password for (e.g., Windows Computer, iPhone, or other).
    - Click on "Generate" to create your new app password.

6. **Copy and Use the App Password:**
    - A 16-character code will be displayed on your screen. This is your app password, and you'll use it instead of your regular password for setting up IMAP access in clearmail.
    - Follow any on-screen instructions to enter the app password into clearmail's configuration. Typically, you'll replace your regular password with this app password in the `.env` file where IMAP credentials are specified.

### Step 2: Configure the YAML File

Navigate to the `config.yml` file in the clearmail directory. Customize these settings to match your email management preferences.

#### YAML File Options

The `config.yml` file contains several options to customize how clearmail works:

- `useLocalLLM`: Determines whether to use a local language model or OpenAI for email analysis.
- `maxEmailChars`: The maximum number of characters from an email body to feed to the AI for analysis.
- `maxEmailsToProcessAtOnce`: Limits the number of emails processed in a single batch.
- `refreshInterval`: How often, in seconds, to check for new emails.
- `timestampFilePath`: The file path for storing the timestamp of the last processed email.
- `sortIntoCategoryFolders`: Whether to sort emails into specified categories.
- `rejectedFolderName`: The name of the folder where rejected emails are moved.
- `categoryFolderNames`: A list of folder names for categorizing emails.
- `rules`: Simple rules defining which emails to keep or reject.

Additional details are included as comments in `config.yml`.

### Step 3: Configure .env File

To integrate your environment with clearmail, you'll need to configure the `.env` file by setting up various environment variables that the application requires to run. Copy the `.env.example` to `.env` and fill in the following:

#### .env File Configuration

1. **OPENAI_API_KEY**:
    - **Description**: Optional.  If you choose to not use a local LLM, fill in your OpenAI API key here.

2. **IMAP_USER**:
    - **Description**: Your email address that you will use to access your Gmail account via IMAP.

3. **IMAP_PASSWORD**:
    - **Description**: Use app password generated above.

4. **IMAP_HOST**:
    - **Description**: The IMAP server address for Gmail.
    - **Default Value**: `imap.gmail.com`. This is pre-set for Gmail accounts and typically does not need to be changed.

5. **IMAP_PORT**:
    - **Description**: The port number used to connect to the IMAP server.
    - **Default Value**: `993`. This is the standard port for IMAP over SSL (IMAPS) and is used by Gmail.

#### Example .env File Content

```plaintext
OPENAI_API_KEY=your_openai_api_key_here
IMAP_USER=yourname@gmail.com
IMAP_PASSWORD=your_app_password_or_regular_password_here
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
```

### Step 4: Run the Process

Expanding on Step 4 to include instructions on setting up Node.js on your machine and ensuring you navigate to the correct folder to run `clearmail`:

#### Installing Node.js

Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine, and it's required to run `clearmail`. Here's how to install it:

1. **Download Node.js**: Visit the [official Node.js website](https://nodejs.org/) to download the installer for your operating system. It is recommended to download the LTS (Long Term Support) version for better stability.

2. **Install Node.js**:
   - **Windows & macOS**: Run the downloaded installer and follow the on-screen instructions. The installer includes Node.js and npm (Node Package Manager).
   - **Linux**: You can install Node.js via a package manager. Instructions for different distributions are available on the Node.js website under the [Linux installations guide](https://nodejs.org/en/download/package-manager/).

3. **Verify Installation**: Open a terminal or command prompt and type the following commands to verify that Node.js and npm are installed correctly:

    ```bash
    node --version
    npm --version
    ```

   If the installation was successful, you should see the version numbers for both Node.js and npm.

#### Navigating to the clearmail Directory

Before running the `clearmail` process, make sure you are in the directory where `clearmail` is located:

1. **Open a Terminal or Command Prompt**: Use a terminal on Linux or macOS, or Command Prompt/Powershell on Windows.

2. **Navigate to the clearmail Directory**: Use the `cd` (change directory) command to navigate to the folder where you have `clearmail` installed. For example, if you have `clearmail` in a folder named "clearmail" on your desktop, the command might look like this:

   - On Windows:
       ```bash
       cd Desktop\clearmail
       ```
   - On Linux or macOS:
       ```bash
       cd ~/Desktop/clearmail
       ```

#### Running clearmail

Once Node.js is installed and you are in the correct directory, you can start `clearmail` by running the following command in your terminal or command prompt:

```bash
node server.js
```

This will initialize clearmail and begin sorting your emails according to the defined rules.  It will continue to run at the defined interval and output data about its activities to the shell.

#### Stopping clearmail

To stop the clearmail process type `<ctrl> + c` on Mac.


## Large Language Model (LLM) Choice: Local or OpenAI

Clearmail supports integration with any running local LLM and is configured out of the box to support default LM Studio settings. The advantage of Local LLMs is privacy and zero inference costs, but the tradeoff is likely performance.  For that reason, clearmail also supports using any OpenAI chat completion model.

### Local Option: Setting Up LM Studio

[LM Studio](https://lmstudio.ai/) is a powerful platform that allows you to run large language models locally. To get started, follow these steps:

1. **Download and Install LM Studio:** Visit [https://lmstudio.ai/](https://lmstudio.ai/) and download the latest version of LM Studio for your operating system. Follow the installation instructions provided on the website.

2. **Start an Inference Server:** Once LM Studio is installed, launch the application and start an inference server. This server will handle requests from clearmail to process emails.

3. **Download a Language Model:** Any model can work, but we recommend searching for `TheBloke/Mistral-7B-Instruct-v0.2-code-ft-GGUF` within LM Studio's model marketplace and download any of the models listed there. These models are specifically tailored for instruction-following tasks and code generation, making them well-suited for analyzing and categorizing emails.

4. **Specify the Connection String:** After setting up the inference server, note the connection string provided by LM Studio. If you modify it, update clearmail's `config.yml` under the `localLLM.postURL` field to ensure clearmail can communicate with the local LLM server.  If you don't modify it, clearmail will work out of the box with LMStudio's loaded model.

### Configuration in clearmail

Once your LM Studio server is running and the model is downloaded, configure clearmail to use the local LLM by editing the `config.yml` file:

```yaml
settings:
  useLocalLLM: true

localLLM:
  postURL: http://localhost:1234/v1/chat/completions  # Replace with your actual LM Studio connection string
```

Make sure the `useLocalLLM` setting is set to `true` and the `postURL` points to your running LM Studio inference server.

### Using OpenAI

While using local LLMs can offer many advantages, it's important to note that performance and reliability may vary compared to using OpenAI's APIs. We have included some `fixJSON` work in the clearmail codebase to address potential inconsistencies with model outputs, but local models can still be somewhat unreliable. If you encounter issues, consider using OpenAI but keep in mind you are sending your emails to their AI and you need to be comfortable with that level of not-privacy.

For best performance, we recommend using OpenAI's `gpt-4.5-turbo-0125` model, which offers a good balance between speed, accuracy, and cost. The `gpt-3.5-turbo` model also provides reasonably good performance but may not match the latest advancements found in newer models.

#### Obtaining Your OpenAI API Key

1. **Log in or Sign Up to OpenAI**:
    - Visit the OpenAI platform at [https://platform.openai.com/account/api-keys](https://platform.openai.com/account/api-keys). If you already have an account, log in using your credentials. If you don't, you'll need to sign up and create an account.

2. **Create a New Secret Key**:
    - Once logged in, you'll be directed to the API keys section of your OpenAI account. Look for the "Create new secret key" button and click on it. This action will generate a new API key for you to use with applications like clearmail.

3. **Copy Your Key**:
    - After creating your new secret key, a window will pop up showing your newly generated API key. Use the "Copy" button to copy your key to your clipboard. Make sure to save it in a secure place, as you will need to enter this key into your clearmail configuration.

#### Integrating the API Key into clearmail

1. **Open Your .env File**: Navigate to the root directory of your clearmail project and open the `.env` file in a text editor. If you haven't created this file yet, you can copy and rename the `.env.example` file to `.env`.

2. **Enter Your OpenAI API Key**: Locate the line starting with `OPENAI_API_KEY=` and paste your copied API key right after the equals sign (`=`) without any spaces. It should look something like this:

    ```plaintext
    OPENAI_API_KEY=your_copied_api_key_here
    ```

   Replace `your_copied_api_key_here` with the API key you copied from the OpenAI platform.

3. **Save Changes**: After entering your API key, save the `.env` file. This update will allow clearmail to use your OpenAI API key to access the AI services required for email analysis.

## Using PM2 to Manage the clearmail Process

[PM2](https://pm2.keymetrics.io/) is a process manager for Node.js applications that can help manage and keep your clearmail process running in the background. To use PM2 with clearmail:

1. Install PM2 globally using npm:

    ```bash
    npm install pm2 -g
    ```

2. Start clearmail with PM2:

    ```bash
    pm2 start server.js --name clearmail
    ```

3. To ensure clearmail starts on system reboot, use the `pm2 startup` command and follow the instructions provided.

4. To stop clearmail, use:

    ```bash
    pm2 stop clearmail
    ```

## Contact

For questions, suggestions, or contributions, please get in touch with the project owner, [Andy Walters](mailto:andywalters@gmail.com). Your feedback is much appreciated!

Project sponsored by [Emerge Haus](https://emerge.haus), a custom Generative AI consultancy & dev shop.