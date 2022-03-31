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
            'email'   => 'required|email',
            'profile' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ],
    ]
];
