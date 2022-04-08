<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Resource;

class BookingOrder extends Model
{
    public function resource()
    {
        return $this->belongsTo(Resource::class)->select('title', 'id');
    }
}
