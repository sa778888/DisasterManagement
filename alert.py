import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

# SMTP Configuration (Gmail Example)
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
EMAIL_ADDRESS = "arshlaan.siddiquie2022@vitstudent.ac.in"  # Replace with your email
EMAIL_PASSWORD = "aumo wsqs jexw wpld"  # Use an App Password for security

# Receiver Email
TO_EMAIL = "gerardine@vit.ac.in"
# CC_EMAIL='gerardine@vit.ac.in'
# TO_EMAIL='rohansinghpoona@gmail.com'
# Create the email
msg = MIMEMultipart()
msg["From"] = EMAIL_ADDRESS
msg["To"] = TO_EMAIL
# msg["Cc"] = CC_EMAIL 
msg["Subject"] = "⚠️ URGENT: Natural Disaster Alert! ⚠️"

# HTML Email Content with Graphics
html_content = """
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f8d7da;
            color: #721c24;
            text-align: center;
            padding: 20px;
        }
        .alert-box {
            max-width: 600px;
            margin: auto;
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0px 0px 10px #b22222;
            border: 2px solid #b22222;
        }
        h1 {
            color: #b22222;
            font-size: 24px;
        }
        .warning {
            font-size: 18px;
            font-weight: bold;
        }
        .image {
            width: 100%;
            border-radius: 10px;
        }
        .footer {
            margin-top: 15px;
            font-size: 14px;
            color: #555;
        }
    </style>
</head>
<body>
    <div class="alert-box">
        <h1>⚠️ EMERGENCY ALERT ⚠️</h1>
        <p class="warning">A natural disaster warning has been issued in your area.</p>
        <img class="image" src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/2011_Sendai_earthquake_tsunami.jpg/600px-2011_Sendai_earthquake_tsunami.jpg" alt="Disaster Image">
        <p>Please follow local emergency guidelines and stay safe.</p>
        <p><strong>DO NOT IGNORE THIS MESSAGE.</strong></p>
        <div class="footer">
            <p>National Emergency Response Team</p>
            <p>Visit <a href="https://www.ready.gov/">Ready.gov</a> for safety information.</p>
        </div>
    </div>
</body>
</html>
"""

# Attach the HTML content
msg.attach(MIMEText(html_content, "html"))

# Send the email
try:
    server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
    server.starttls()
    server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
    server.sendmail(EMAIL_ADDRESS, TO_EMAIL, msg.as_string())
    server.quit()
    print("Disaster Alert Sent Successfully!")
except Exception as e:
    print(f"Error sending email: {e}")
