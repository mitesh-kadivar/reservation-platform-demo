<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class AuthController extends Controller
{
    /**
     * Login
     *
     * @param   Request $request
     * @author  Harshil Shah <harshil.shah@bytestechnolab.in>
     * @return  JsonResponse
     */

    public function login(Request $request) : JsonResponse
    {
        $validator = Validator::make($request->all(), config('validator.user.login'));
        if ($validator->fails()) {
            return $this->validationError($validator, $validator->messages()->first());
        }
        try {
            $user = User::where('email', $request->email)->first();
            if (!$user) {
                return $this->error('USER_DOES_NOT_EXIST');
            }

            if (Hash::check($request->password, $user->password)) {
                DB::table('oauth_access_tokens')->where('user_id', '=', $user->id)->delete();

                $user->token =  $user->createToken('authToken')->accessToken;
                $response = $user;
                return $this->success($response, "USER_LOGGED");
            } else {
                return $this->error('INVALID_CREDENTIALS');
            }
        } catch (\Exception $ex) {
            return $this->error(($ex->getCode() == 423) ? $ex->getMessage() : 'ERROR');
        }
    }
}
