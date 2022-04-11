<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use App\Models\BookingOrder;
use Illuminate\Support\Facades\Auth;

class BookingController extends Controller
{
    /**
     * Get booking orders
     *
     * @author  Mitesh Kadivar <mitesh.kadivar@bytestechnolab.in>
     * @return  JsonResponse
     */

    public function index() : JsonResponse
    {
        try {
            $order = BookingOrder::with('resource')->where('user_id', Auth::user()->id)->get();
            foreach ($order as $value) {
                $value->resource_name = $value->resource->title;
            }
            return $this->success($order, "BOOKING_LIST");
        } catch (\Exception $ex) {
            return $this->error($ex->getMessage());
        }
    }

    /**
     * Add resource booking
     *
     * @param   Request $request
     * @author  Mitesh Kadivar <mitesh.kadivar@bytestechnolab.in>
     * @return  JsonResponse
     */

    public function addBooking(Request $request) : JsonResponse
    {
        $validator = Validator::make($request->all(), config('validator.book.add'));
        if ($validator->fails()) {
            return $this->validationError($validator, $validator->messages()->first());
        }

        try {
            $order              = new BookingOrder();
            $order->user_id     = $request->user_id;
            $order->resource_id = $request->resource;
            $order->start_date  = $request->start_date;
            $order->end_date    = $request->end_date;

            if ($order->save()) {
                return $this->success($order, "ORDER_BOOKED");
            }
        } catch (\Exception $ex) {
            return $this->error(($ex->getCode() == 423) ? $ex->getMessage() : 'ERROR');
        }
    }

    /**
     * Check resource booked
     *
     * @param   Request $request
     * @author  Mitesh Kadivar <mitesh.kadivar@bytestechnolab.in>
     * @return  JsonResponse
     */

    public function isResourceBooked(Request $request) : JsonResponse
    {
        $validator = Validator::make($request->all(), config('validator.book.is_resource_booked'));
        if ($validator->fails()) {
            return $this->validationError($validator, $validator->messages()->first());
        }

        try {
            $order = BookingOrder::where('resource_id', $request->resource)
            ->where(function ($query) use ($request) {
                      $query->where([['start_date','<=',$request->start_date],['end_date','>=',$request->end_date]])
                      ->orwhereBetween('start_date', array($request->start_date,$request->end_date))
                      ->orWhereBetween('end_date', array($request->start_date,$request->end_date));
            })->get();

            if ($order->count() > 0) {
                return $this->error("ALREADY_BOOKED");
            } else {
                return $this->success([], "AVAILABLE_RESOURCE");
            }
        } catch (\Exception $ex) {
            return $this->error(($ex->getCode() == 423) ? $ex->getMessage() : 'ERROR');
        }
    }

    /**
     * Cancel Resource Booked order.
     *
     * @param   Request $request
     * @author  Mitesh Kadivar <mitesh.kadivar@bytestechnolab.in>
     * @return  JsonResponse
     */
    public function cancelResourceBookedOrder(Request $request) : JsonResponse
    {
        $order = BookingOrder::whereId($request->id)->first();
        if ($order === null) {
            return $this->error("NOT_FOUND");
        }
        try {
            if ($order->delete()) {
                return $this->success([], "ORDER_CANCELLED");
            } else {
                return $this->error("ERROR");
            }
        } catch (\Exception $ex) {
            return $this->error(($ex->getCode() == 423) ? $ex->getMessage() : 'ERROR');
        }
    }
}
