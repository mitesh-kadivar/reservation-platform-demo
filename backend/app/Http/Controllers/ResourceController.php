<?php

namespace App\Http\Controllers;

use App\Models\Resource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cache;
use App\Models\User;
use App\Models\Category;

class ResourceController extends Controller
{
    /**
     * Get a list of resources
     * @author Harshil Shah
     * @return JsonResponse
     */
    public function index() : JsonResponse
    {
        try {
            $resources = Resource::where('status', 1)->with('categories')->latest()->paginate(config('config.pagination'));
            return $this->success($resources, 'RESOURCES_LIST');
        } catch (\Exception $ex) {
            return $this->error($ex->getMessage());
        }
    }

    /**
     * Store a new resource
     * @param Request $request
     * @author Harshil Shah
     * @return JsonResponse
     */
    public function store(Request $request) : JsonResponse
    {
        $validator = Validator::make($request->all(), config('validator.resource.add_resource'));
        if ($validator->fails()) {
            return $this->validationError($validator, $validator->messages()->first());
        }

        if ($request->image) {
            directoryObserver(config('config.resource.resource_image_path'));
            $image =  $request->image;
            $name = time().'.' . explode('/', explode(':', substr($image, 0, strpos($image, ';')))[1])[1];
            \Storage::disk('local')->putFileAs(config('config.resource.resource_image_path'), $image, $name);

            $uploadedImage = $name;
        }

        try {
            $resource              = new Resource();
            $resource->title       = $request->title;
            $resource->category_id = $request->category_id;

            if (isset($request->image)) {
                $resource->image   = $uploadedImage;
            }

            $resource->save();

            return $this->success($resource, 'RESOURCE_INSERTED');
        } catch (\Exception $ex) {
            return $this->error(($ex->getCode() == 423) ? $ex->getMessage() : 'ERROR');
        }
    }

    /**
     * Edit an existing resource
     * @param int $id
     * @author Harshil Shah
     * @return JsonResponse
     */
    public function edit(int $id) : JsonResponse
    {
        $resource = Resource::whereId($id)->first();

        if ($resource === null) {
            return $this->error("RESOURCE_DOES_NOT_EXIST");
        }

        return $this->success($resource, 'RESOURCE_FOUND');
    }

    public function getCategories() : JsonResponse
    {
        $categories = Category::select('id', 'title')->get();

        if ($categories === null) {
            return $this->error("NO_CATEGORIES");
        }

        return $this->success($categories, "CATEGORIES_LIST");
    }

    /**
     * Update an existing resource
     * @param Request $request
     * @author Harshil Shah
     * @return JsonResponse
     */
    public function update(Request $request) : JsonResponse
    {
        $resource = Resource::whereId($request->id)->first();

        if ($resource === null) {
            return $this->error("RESOURCE_DOES_NOT_EXIST");
        }

        $validations = config('validator.resource.update_resource');
        $validations['title'] = 'required|unique:resources,title,'.$request->id;

        $validator = Validator::make($request->all(), config('validator.resource.update_resource'));
        if ($validator->fails()) {
            return $this->validationError($validator, $validator->messages()->first());
        }

        if ($request->image) {
            directoryObserver(config('config.resource.resource_image_path'));
            $image =  $request->image;
            $name = time().'.' . explode('/', explode(':', substr($image, 0, strpos($image, ';')))[1])[1];
            \Storage::disk('local')->putFileAs(config('config.resource.resource_image_path'), $image, $name);

            $uploadedImage = $name;
        }

        try {
            $resource->title = $request->title;

            if (isset($request->image)) {
                $resource->image = $uploadedImage;
            }

            $resource->save();

            return $this->success($resource, 'RESOURCE_UPDATED');
        } catch (\Exception $ex) {
            return $this->error(($ex->getCode() == 423) ? $ex->getMessage() : 'ERROR');
        }
    }

    /**
     * Delete a resource
     * @param int $id
     * @author Harshil Shah
     * @return JsonResponse
     */
    public function delete(int $id)
    {
        $resource = Resource::whereId($id)->first();

        if ($resource === null) {
            return $this->error("RESOURCE_DOES_NOT_EXIST");
        }

        try {
            if ($resource->delete()) {
                return $this->success([], "RESOURCE_DELETED");
            } else {
                return $this->error("ERROR");
            }
        } catch (\Exception $ex) {
            return $this->error(($ex->getCode() == 423) ? $ex->getMessage() : 'ERROR');
        }
    }

    /**
     * get Resource Title
     *
     * @author  Mitesh Kadivar <mitesh.kadivar@bytestechnolab.in>
     * @return  JsonResponse
     */

    public function getResourceTitle() : JsonResponse
    {
        try {
            # Check the records in cache
            if (Cache::has('resource') && (Resource::count() == Cache::get('resource')->count())) {
                $resources = Cache::get('resource');
            } else {
                $resources = Resource::select('id', 'title')->get();
                Cache::add('resource', $resources);
            }
            return $this->success($resources, "RESOURCES_LIST");
        } catch (\Exception $ex) {
            return $this->error($ex->getMessage());
        }
    }
}
