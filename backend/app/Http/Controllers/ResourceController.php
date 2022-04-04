<?php

namespace App\Http\Controllers;

use App\Models\Resource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

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
            $resources = Resource::where('status', 1)->with('categories')->get();
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

        try {
            $resource              = new Resource();
            $resource->title       = $request->title;
            $resource->category_id = $request->category_id;

            if (isset($request->image)) {
                $resource->image   = $request->image;
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

        $validator = Validator::make($request->all(), config('validator.resource.update_resource'));
        if ($validator->fails()) {
            return $this->validationError($validator, $validator->messages()->first());
        }

        try {
            $resource->title = $request->title;

            if (isset($request->image)) {
                $resource->image = $request->image;
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
}
