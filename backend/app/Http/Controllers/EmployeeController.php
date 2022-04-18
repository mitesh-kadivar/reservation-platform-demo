<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use App\Events\EmailNotificationEvent;
use Illuminate\Support\Facades\Cache;
use App\Models\User;

class EmployeeController extends Controller
{
    /**
     * get employees
     *
     * @author  Mitesh Kadivar <mitesh.kadivar@bytestechnolab.in>
     * @return  JsonResponse
     */

    public function index(Request $request) : JsonResponse
    {
        try {
            $params = array_keys($request->all());
            $searches = [];
            # Check the records in cache
            if (Cache::has('users') && (User::count() == Cache::get('users')->count())) {
                $users = Cache::get('users');
            } else {
                $users = User::select('id', 'name', 'email', 'description', 'profile')
                                ->latest()
                                ->where('is_type', 2);
                        foreach ($params as $key => $param) {
                            if (strstr($param, 'like')) {
                                $search = explode('_', $param)[0];
                                $users  = $users->where($search, 'like', '%'.$request[$param].'%');
                            }
                        }
                $users = $users->paginate(config('config.pagination'));
                Cache::add('users', $users);
            }
            return $this->success($users, "EMPLOYEES_LIST");
        } catch (\Exception $ex) {
            return $this->error($ex->getMessage());
        }
    }

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
            $randPassword = randomPassword();
            if ($request->profile) {
                directoryObserver(config('config.user.profile_image_path'));
                $image =  $request->profile;
                $name = time().'.' . explode('/', explode(':', substr($image, 0, strpos($image, ';')))[1])[1];
                \Storage::disk('local')->putFileAs(config('config.user.profile_image_path'), $image, $name);

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
            $user->password    = Hash::make($randPassword);
            $user->profile     = $uploadedImage;
            $user->description = $request->description;

            if ($user->save()) {
                $model = [
                    'to_email'      => trim($request->email),
                    'user_name'     => trim($user->name),
                    'user_password' => $randPassword,
                    'slug'          => 'send_login_credentials',
                ];
                event(new EmailNotificationEvent($model));
                Cache::forget('users');
                return $this->success($user, "EMPLOYEE_INSERTED");
            }
        } catch (\Exception $ex) {
            return $this->error(($ex->getCode() == 423) ? $ex->getMessage() : 'ERROR');
        }
    }

    /**
     * Edit Employee.
     *
     * @param   int $id
     * @author  Mitesh Kadivar <mitesh.kadivar@bytestechnolab.in>
     * @return  JsonResponse
     */
    public function edit(int $id) : JsonResponse
    {
        $user = User::whereId($id)->first();

        if ($user === null) {
            return $this->error("NOT_FOUND");
        }

        return $this->success($user, "EMPLOYEES_LIST");
    }

    /**
     * Update Employee
     *
     * @param   Request $request
     * @param   int $id
     * @author  Mitesh Kadivar <mitesh.kadivar@bytestechnolab.in>
     * @return  JsonResponse
     */
    public function update($id, Request $request) : JsonResponse
    {
        $user = User::find($id);
        if ($user === null) {
            return $this->error("NOT_FOUND");
        }
        if ($user->is_type == 1) {
            return $this->error("ADMIN_UPDATE");
        }
        $validator = config('validator.user.update-employee');
        $validator['email'] = 'email|unique:users,email,'.$id;
        $validator = Validator::make($request->all(), $validator);
        if ($validator->fails()) {
            return $this->validationError($validator, $validator->messages()->first());
        }

        try {
            $user->name  = trim($request->name);
            $user->email = trim($request->email);

            if ($request->profile) {
                directoryObserver(config('config.user.profile_image_path'));
                $image =  $request->profile;
                $name = time().'.' . explode('/', explode(':', substr($image, 0, strpos($image, ';')))[1])[1];
                \Storage::disk('local')->putFileAs(config('config.user.profile_image_path'), $image, $name);

                if ($user->profile) {
                    unlink(public_path(config('config.user.profile_image_path'). $user->profile));
                }
                $user->profile = $name;
            }
            $user->description = $request->description;
            if (!$user->save()) {
                return $this->error("ERROR");
            }
            Cache::forget('users');
            return $this->success($user, "EMPLOYEE_UPDATED");
        } catch (\Exception $ex) {
            return $this->error(($ex->getCode() == 423) ? $ex->getMessage() : 'ERROR');
        }
    }

    /**
     * Remove Employee.
     *
     * @param   Request $request
     * @author  Mitesh Kadivar <mitesh.kadivar@bytestechnolab.in>
     * @return  JsonResponse
     */
    public function destroy(Request $request) : JsonResponse
    {
        $user = User::whereId($request->id)->first();
        if ($user === null) {
            return $this->error("NOT_FOUND");
        }
        if ($user->is_type == 1) {
            return $this->error("ADMIN_DELETE");
        }
        try {
            if ($user->profile) {
                unlink(public_path(config('config.user.profile_image_path'). $user->profile));
            }
            if ($user->delete()) {
                Cache::forget('users');
                return $this->success([], "EMPLOYEE_DELETED");
            } else {
                return $this->error("ERROR");
            }
        } catch (\Exception $ex) {
            return $this->error(($ex->getCode() == 423) ? $ex->getMessage() : 'ERROR');
        }
    }

    /**
     * Update Employee Profile
     *
     * @param   Request $request
     * @param   int $id
     * @author  Mitesh Kadivar <mitesh.kadivar@bytestechnolab.in>
     * @return  JsonResponse
     */
    public function updateProfile($id, Request $request) : JsonResponse
    {
        $user = User::find($id);
        if ($user === null) {
            return $this->error("NOT_FOUND");
        }

        $validator = config('validator.user.update-employee');
        $validator = Validator::make($request->all(), $validator);
        if ($validator->fails()) {
            return $this->validationError($validator, $validator->messages()->first());
        }

        try {
            $user->name  = trim($request->name);

            if ($request->profile) {
                directoryObserver(config('config.user.profile_image_path'));
                $image =  $request->profile;
                $name = time().'.' . explode('/', explode(':', substr($image, 0, strpos($image, ';')))[1])[1];
                \Storage::disk('local')->putFileAs(config('config.user.profile_image_path'), $image, $name);

                if ($user->profile) {
                    unlink(public_path(config('config.user.profile_image_path'). $user->profile));
                }
                $user->profile = $name;
            }
            $user->description = $request->description;
            if (!$user->save()) {
                return $this->error("ERROR");
            }
            Cache::forget('users');
            return $this->success($user, "EMPLOYEE_PROFILE_UPDATED");
        } catch (\Exception $ex) {
            return $this->error(($ex->getCode() == 423) ? $ex->getMessage() : 'ERROR');
        }
    }
}
