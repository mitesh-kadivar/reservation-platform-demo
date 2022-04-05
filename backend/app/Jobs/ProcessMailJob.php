<?php

namespace App\Jobs;

use Illuminate\Support\Facades\Mail;
use App\Mail\SendEmployeePasswordEmail;
use Log;

class ProcessMailJob extends Job
{
    private $model;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($model)
    {
        $this->model = $model;
        Log::info('Hello! Queue job is PRocess - '.microtime(true));
    }

    /**
     * Execute the job.
     *
     * @author  Mitesh Kadivar <mitesh.kadivar@bytestechnolab.in>
     * @return void
     */
    public function handle()
    {
        Log::info('Hello! Queue job is Process before sennd - '.microtime(true));

        $slug = $this->model['slug'];
        if ($slug == 'send_login_credentials') {
            $this->sendEmployeeCredentials();
        }
    }

    /**
     * Send mail to employee for login credentials.
     *
     * @author  Mitesh Kadivar <mitesh.kadivar@bytestechnolab.in>
     */
    private function sendEmployeeCredentials()
    {
        Mail::to($this->model['to_email'])
                ->send(new SendEmployeePasswordEmail($this->model));
    }
}
