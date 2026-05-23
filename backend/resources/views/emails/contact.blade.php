<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">

<style>
    body {
        margin: 0;
        padding: 0;
        background: #f3f4f6;
        font-family: 'Segoe UI', Arial, sans-serif;
    }

    .wrapper {
        padding: 40px 10px;
    }

    .card {
        max-width: 640px;
        margin: auto;
        background: #ffffff;
        border-radius: 14px;
        overflow: hidden;
        box-shadow: 0 10px 40px rgba(0,0,0,0.08);
    }

    .header {
        padding: 25px;
        background: #111827;
        color: white;
        text-align: center;
    }

    .header h1 {
        margin: 0;
        font-size: 20px;
        font-weight: 600;
    }

    .content {
        padding: 25px;
    }

    .row {
        padding: 12px 0;
        border-bottom: 1px solid #e5e7eb;
        font-size: 14px;
        color: #111827;
    }

    .label {
        font-weight: 600;
        color: #374151;
        display: inline-block;
        width: 90px;
    }

    .message {
        margin-top: 20px;
        padding: 15px;
        background: #f9fafb;
        border-radius: 10px;
        font-size: 14px;
        color: #111827;
        border-left: 3px solid #111827;
        white-space: pre-line;
    }

    .footer {
        text-align: center;
        padding: 15px;
        font-size: 12px;
        color: #9ca3af;
        background: #f9fafb;
    }
</style>

</head>

<body>

<div class="wrapper">

    <div class="card">

        <!-- HEADER -->
        <div class="header">
            <h1>New Contact Message</h1>
        </div>

        <!-- CONTENT -->
        <div class="content">

            <div class="row"><span class="label">Subject:</span> {{ $data['subject'] }}</div>
            <div class="row"><span class="label">name:</span> {{ $data['name'] }}</div>
            <div class="row"><span class="label">Email:</span> {{ $data['email'] }}</div>
            <div class="row"><span class="label">Phone:</span> {{ $data['phone'] }}</div>
            <div class="row"><span class="label">Address:</span> {{ $data['address'] }}</div>

            <div class="message">
                {{ $data['message'] }}
            </div>

        </div>

        

    </div>

</div>

</body>
</html>