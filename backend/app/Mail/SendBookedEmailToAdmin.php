<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SendBookedEmailToAdmin extends Mailable
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
        $userName         = "Admin";
        $emailBodyContent = "<p>The <b>".$this->model['resource']. "</b> resource are booked from <b>".$this->model['start_date'] ." </b> to <b>".$this->model['end_date'] ." </b> by <b>".$this->model['user_name']."</b>.</p>";

        $mail = $this
                //->from(env('MAIL_FROM_ADDRESS'))
                ->view('mails.admin-mail-resource-booked')
                // ->with($withData)
                ->with(['html_data'=> $emailBodyContent, 'name' => $userName]);
        return $mail;
    }
}
