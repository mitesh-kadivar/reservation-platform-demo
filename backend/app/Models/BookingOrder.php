<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;
use App\Models\Resource;
use App\Models\User;

class BookingOrder extends Model
{
    use SoftDeletes;

    public function resource()
    {
        return $this->belongsTo(Resource::class)->select('title', 'id');
    }
    public function user()
    {
        return $this->belongsTo(User::class)->select('name', 'email', 'id');
    }
}
