<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;
use App\Models\Category;

class Resource extends Model
{
    use SoftDeletes;
    public $timestamps = true;

    public function categories()
    {
        return $this->hasOne(Category::class, 'id', 'category_id')->select('id', 'title');
    }
}
