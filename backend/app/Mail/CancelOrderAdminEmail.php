<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CancelOrderAdminEmail extends Mailable
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
        $emailBodyContent = "<p>The <b>".$this->model['resource']. "</b> resource has been cancelled order from <b>".$this->model['start_date'] ." </b> to <b>".$this->model['end_date'] ." </b> for the <b>".$this->model['user_name']."</b> employee.</p>";

        $mail = $this
                //->from(env('MAIL_FROM_ADDRESS'))
                ->view('mails.admin-mail-resource-booked')
                // ->with($withData)
                ->with(['html_data'=> $emailBodyContent, 'name' => $userName]);
        return $mail;
    }
}
