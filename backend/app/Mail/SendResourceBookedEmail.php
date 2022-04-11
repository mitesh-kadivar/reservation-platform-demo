<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SendResourceBookedEmail extends Mailable
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
        $emailBodyContent = "<p>The <b>".$this->model['resource']. "</b> resource are booked from <b>".$this->model['start_date'] ." </b> to <b>".$this->model['end_date'] ." </b></p>";

        $mail = $this
                //->from(env('MAIL_FROM_ADDRESS'))
                ->view('mails.resource-booked')
                // ->with($withData)
                ->with(['html'=> $emailBodyContent, 'name' => $userName]);
        return $mail;
    }
}
