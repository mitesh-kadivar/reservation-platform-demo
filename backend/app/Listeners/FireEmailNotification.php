<?php

namespace App\Listeners;

use App\Events\EmailNotificationEvent;
use App\Jobs\ProcessMailJob;

class FireEmailNotification
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the email event
     *
     * @param   EmailNotificationEvent $event
     * @author  Mitesh Kadivar <mitesh.kadivar@bytestechnolab.in>
     */
    public function handle(EmailNotificationEvent $event)
    {
        if (!env('SEND_MAIL')) {
            return '';
        }
        
        $slug = $event->model['slug'];

        if ($slug == 'send_login_credentials') {
            $this->sendEmployeePassword($event->model);
        }
        if ($slug == 'resource_booked') {
            $this->resourceBooked($event->model);
        }
    }

    /**
     * Call the queue to send forgot password mail to specific user
     * Used for send property transition document
     *
     * @param   mixed $data
     * @author  Mitesh Kadivar <mitesh.kadivar@bytestechnolab.in>
     */
    private function sendEmployeePassword($data)
    {
        dispatch(new ProcessMailJob($data));
    }

    /**
     * Call the queue to send resource booked mail to specific user
     * Used for send property transition document
     *
     * @param   mixed $data
     * @author  Mitesh Kadivar <mitesh.kadivar@bytestechnolab.in>
     */
    private function resourceBooked($data)
    {
        dispatch(new ProcessMailJob($data));
    }
}
