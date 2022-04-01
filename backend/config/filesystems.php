<?php

return [
  'disks' => [
    'local' => [
        'driver' => 'local',
        'root'   => public_path(), // previously storage_path();
    ],
  ]
];