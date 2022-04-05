<?php

namespace App\Events;

class EmailNotificationEvent extends Event
{
    public $model;

    /**
     * Create instance of class
     *
     * @param mixed $model
     */
    public function __construct($model)
    {
        $this->model = $model;
    }

    /**
     * Broadcast data
     */
    public function broadcastOn()
    {
        return [];
    }
}
