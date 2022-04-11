<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;
use App\Models\Resource;

class BookingOrder extends Model
{
    use SoftDeletes;

    public function resource()
    {
        return $this->belongsTo(Resource::class)->select('title', 'id');
    }
}
