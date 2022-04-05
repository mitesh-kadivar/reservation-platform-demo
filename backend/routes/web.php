<?php

/** @var \Laravel\Lumen\Routing\Router $router */
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->get('/', function () use ($router) {
    return $router->app->version();
});

$router->group(['prefix' => 'api'], function () use ($router) {
    $router->group(['prefix' => 'auth'], function () use ($router) {
        $router->post('login', 'AuthController@login');
    });

    $router->group(['middleware' => 'auth'], function () use ($router) {
        $router->post('change-password', 'AuthController@changePassword');

        # Empoyees
        $router->group(['prefix' => 'employees'], function () use ($router) {
            $router->post('add', 'EmployeeController@store');
            $router->get('get', 'EmployeeController@index');
            $router->delete('delete/{id}', 'EmployeeController@destroy');
            $router->get('edit/{id}', 'EmployeeController@edit');
            $router->put('update/{id}', 'EmployeeController@update');
        });

        # Resources
        $router->group(['prefix' => 'resources'], function() use ($router) {
            $router->get('list', 'ResourceController@index');
            $router->post('add', 'ResourceController@store');
            $router->put('edit/{id}', 'ResourceController@edit');
            $router->post('update', 'ResourceController@update');
            $router->delete('delete/{id}', 'ResourceController@delete');
        });
    });
});
