<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BookinController extends Controller
{
    /**
     * Add resource booking
     *
     * @param   Request $request
     * @author  Mitesh Kadivar <mitesh.kadivar@bytestechnolab.in>
     * @return  JsonResponse
     */

    public function addBooking(Request $request)
    {
        $validator = Validator::make($request->all(), config('validator.book.add'));
        if ($validator->fails()) {
            return $this->validationError($validator, $validator->messages()->first());
        }

        return $request->all();
    }
}
