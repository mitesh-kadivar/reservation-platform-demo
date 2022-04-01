<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class EmployeeController extends Controller
{
    /**
     * Create new employee
     *
     * @param   Request $request
     * @author  Mitesh Kadivar <mitesh.kadivar@bytestechnolab.in>
     * @return  JsonResponse
     */

    public function store(Request $request) : JsonResponse
    {
        $validator = Validator::make($request->all(), config('validator.user.add-employee'));
        if ($validator->fails()) {
            return $this->validationError($validator, $validator->messages()->first());
        }

        try {
            $uploadedImage = "";
            if ($request->profile) {

                directoryObserver(config('config.user.profile_image_path'));
                $image =  $request->profile;
                $name = time().'.' . explode('/', explode(':', substr($image, 0, strpos($image, ';')))[1])[1];
                \Storage::disk('local')->putFileAs(config('config.user.profile_image_path'), $image,$name);

                $uploadedImage = $name;

                // Second way to fileupload //
                // directoryObserver(config('config.user.profile_image_path'));
                // $uploadedImage = imageUpload($request->file('profile'), config('config.user.profile_image_path'));

                // $file      = $request->file('profile');
                // $filename  = $file->getClientOriginalName();
                // $extension = $file->getClientOriginalExtension();
                // $picture   = date('His').'-'.$filename;
                // $file->move(public_path(config('config.user.profile_image_path')), $picture);
                // $uploadedImage = $picture;
            }

            $user              = new User();
            $user->name        = trim($request->name);
            $user->email       = trim($request->email);
            $user->password    = Hash::make('User@123');
            $user->profile     = $uploadedImage;
            $user->description = $request->description;
            $user->save();

            return $this->success($user, "EMPLOYEE_INSERTED");
        } catch (\Exception $ex) {
            return $this->error(($ex->getCode() == 423) ? $ex->getMessage() : 'ERROR');
        }
    }
}
