<?php

return [
    'user' => [
        'login' => [
            'email'    => 'required|email',
            'password' => 'required',
        ],
        'change_password'=>[
            'old_password'      => 'required|different:new_password',
            'new_password'      => 'required|min:8|same:confirm_password|regex:/[@$!%*#?&]/',
            'confirm_password'  => 'required|min:8'
        ],
        'add-employee' => [
            'name'    => 'required',
            'email'   => 'required|email|unique:users,email',
            // 'profile' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ],
        'update-employee' => [
            'name'    => 'required',
            // 'profile' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ],
    ],
    'resource' => [
        'add_resource' => [
            'title'       => 'required|unique:resources,title',
            'category_id' => 'required|exists:categories,id',
        ],
        'update_resource' => [
            'title'       => 'required|unique:resources,title',
            'category_id' => 'required|exists:categories,id',
        ]
    ],
    'book' => [
        'add' => [
            'user_id'    => 'required',
            'start_date' => 'required',
            'end_date'   => 'required',
            'resource'   => 'required',
        ],
        'is_resource_booked' => [
            'start_date' => 'required',
            'end_date'   => 'required',
            'resource'   => 'required',
        ],
    ]
];
