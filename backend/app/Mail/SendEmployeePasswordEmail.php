<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SendEmployeePasswordEmail extends Mailable
{
    use Queueable, SerializesModels;
    public $model;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($model)
    {
        $this->model = $model;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $userName         = $this->model['user_name'];
        $emailBodyContent = "<p>Employee Password: <b>".$this->model['user_password']. "</b></p>";

        $mail = $this
                //->from(env('MAIL_FROM_ADDRESS'))
                ->view('mails.employee-password')
                // ->with($withData)
                ->with(['html'=> $emailBodyContent, 'name' => $userName]);
        return $mail;
    }
}
