<?php
namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class MyEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $data;

    // ✅ ندخلو data من API
    public function __construct($data)
    {
        $this->data = $data;
    }

    // subject + from
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->data['subject'],
        );
    }

    // view ديال email
    public function content(): Content
    {
        return new Content(
            view: 'emails.contact',
            with: [
                'data' => $this->data
            ]
        );
    }
}