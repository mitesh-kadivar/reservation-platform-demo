<?php

use Carbon\Carbon;
use Illuminate\Contracts\Auth\Factory as AuthFactory;
use Illuminate\Contracts\Debug\ExceptionHandler;
use Illuminate\Support\HtmlString;
use Illuminate\Support\Str;
use Laravel\Lumen\Application;
use Laravel\Lumen\Routing\UrlGenerator;
use Symfony\Component\Debug\Exception\FatalThrowableError;
use Symfony\Component\HttpFoundation\Cookie;
use Illuminate\Contracts\Validation\Factory as ValidationFactory;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Contracts\Auth\Access\Gate;
use Illuminate\Support\Facades\File;
use App\Models\EmailConfiguration;
use Illuminate\Support\Facades\Config;

if (! function_exists('public_path')) {
    /**
     * Get the path to the public folder.
     *
     * @param  string  $path
     * @return string
     */
    function public_path($path = '')
    {
        return rtrim(app()->basePath('public/'.$path), DIRECTORY_SEPARATOR);
    }
}

if (! function_exists('config_path')) {
    /**
     * Get the configuration path.
     *
     * @param  string  $path
     * @return string
     */
    function config_path($path = '')
    {
        return rtrim(app()->basePath('config/'.$path), DIRECTORY_SEPARATOR);
    }
}

if (! function_exists('host_path')) {
    /**
     * Get the configuration path.
     *
     * @param  string  $path
     * @return string
     */
    function host_path($path = '')
    {
        return rtrim(request()->getSchemeAndHttpHost(), DIRECTORY_SEPARATOR);
    }
}

if (! function_exists('mix')) {
    /**
     * Get the path to a versioned Mix file.
     *
     * @param  string  $path
     * @param  string  $manifestDirectory
     * @return \Illuminate\Support\HtmlString
     *
     * @throws \Exception
     */
    function mix($path, $manifestDirectory = '')
    {
        static $manifests = [];
        if (! starts_with($path, '/')) {
            $path = "/{$path}";
        }
        if ($manifestDirectory && ! starts_with($manifestDirectory, '/')) {
            $manifestDirectory = "/{$manifestDirectory}";
        }
        $manifestKey = $manifestDirectory ? $manifestDirectory : '/';
        if (file_exists(public_path($manifestDirectory.'hot'))) {
            return new HtmlString("//localhost:8080{$path}");
        }
        if (in_array($manifestKey, $manifests)) {
            $manifest = $manifests[$manifestKey];
        } else {
            if (! file_exists($manifestPath = public_path($manifestDirectory.'/mix-manifest.json'))) {
                throw new Exception('The Mix manifest does not exist.');
            }
            $manifests[$manifestKey] = $manifest = json_decode(
                file_get_contents($manifestPath),
                true
            );
        }
        if (! array_key_exists($path, $manifest)) {
            throw new Exception(
                "Unable to locate Mix file: {$path}. Please check your ".
                'webpack.mix.js output paths and try again.'
            );
        }
        return new HtmlString($manifestDirectory.$manifest[$path]);
    }
}

if (! function_exists('auth')) {
    /**
     * Get the available auth instance.
     *
     * @param  string|null  $guard
     * @return \Illuminate\Contracts\Auth\Factory|\Illuminate\Contracts\Auth\Guard|\Illuminate\Contracts\Auth\StatefulGuard
     */
    function auth($guard = null)
    {
        if (is_null($guard)) {
            return app(AuthFactory::class);
        }

        return app(AuthFactory::class)->guard($guard);
    }
}

if (! function_exists('abort_if')) {
    /**
     * Throw an HttpException with the given data if the given condition is true.
     *
     * @param  bool    $boolean
     * @param  int     $code
     * @param  string  $message
     * @param  array   $headers
     * @return void
     *
     * @throws \Symfony\Component\HttpKernel\Exception\HttpException
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException
     */
    function abort_if($boolean, $code, $message = '', array $headers = [])
    {
        if ($boolean) {
            abort($code, $message, $headers);
        }
    }
}

if (! function_exists('abort_unless')) {
    /**
     * Throw an HttpException with the given data unless the given condition is true.
     *
     * @param  bool    $boolean
     * @param  int     $code
     * @param  string  $message
     * @param  array   $headers
     * @return void
     *
     * @throws \Symfony\Component\HttpKernel\Exception\HttpException
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException
     */
    function abort_unless($boolean, $code, $message = '', array $headers = [])
    {
        if (! $boolean) {
            abort($code, $message, $headers);
        }
    }
}

if (! function_exists('bcrypt')) {
    /**
     * Hash the given value.
     *
     * @param  string  $value
     * @param  array   $options
     * @return string
     */
    function bcrypt($value, $options = [])
    {
        return app('hash')->make($value, $options);
    }
}

if (! function_exists('cookie')) {
    /**
     * Create a new cookie instance.
     *
     * @param  string  $name
     * @param  string  $value
     * @param  int  $minutes
     * @param  string  $path
     * @param  string  $domain
     * @param  bool  $secure
     * @param  bool  $httpOnly
     * @param  bool  $raw
     * @param  string|null  $sameSite
     * @return \Illuminate\Cookie\CookieJar|\Symfony\Component\HttpFoundation\Cookie
     */
    function cookie(
        $name = null,
        $value = null,
        $minutes = 0,
        $path = null,
        $domain = null,
        $secure = false,
        $httpOnly = true,
        $raw = false,
        $sameSite = null
    ) {
        list($path, $domain, $secure, $sameSite) = [$path, $domain, $secure, $sameSite];

        $time = ($minutes == 0) ? 0 : Carbon::now()->addSeconds($minutes * 60)->getTimestamp();

        return new Cookie($name, $value, $time, $path, $domain, $secure, $httpOnly, $raw, $sameSite);
    }
}

if (!function_exists('policy')) {
    /**
     * Get a policy instance for a given class.
     *
     * @param object|string $class
     *
     * @return mixed
     *
     * @throws \InvalidArgumentException
     */
    function policy($class)
    {
        return app(Gate::class)->getPolicyFor($class);
    }
}

if (!function_exists('report')) {
    /**
     * Report an exception.
     *
     * @param  \Exception $exception
     *
     * @return void
     */
    function report($exception)
    {
        if ($exception instanceof Throwable &&
            !$exception instanceof Exception) {
            $exception = new FatalThrowableError($exception);
        }
        app(ExceptionHandler::class)->report($exception);
    }
}

if (!function_exists('action')) {
    /**
     * Generate the URL to a controller action.
     *
     * @param string $name
     * @param array $parameters
     * @param bool $absolute
     *
     * @return string
     */
    function action($name, $parameters = [], $absolute = true)
    {
        /** @var Application $app */
        $app = app();
        $matches = [];
        if (preg_match('/Lumen \(([0-9\.]+)\)/', $app->version(), $matches)) {
            $version = floatval(trim($matches[1]));
            if (5.5 <= $version) {
                $routes = app('router')->getRoutes();
            } else {
                $routes = $app->getRoutes();
            }
        } else {
            $routes = $app->getRoutes();
        }
        foreach ($routes as $route) {
            $uri = $route['uri'];
            $action = $route['action'];
            if (isset($action['uses'])) {
                if ($action['uses'] === $name) {
                    $uri = preg_replace_callback('/\{(.*?)(:.*?)?(\{[0-9,]+\})?\}/', function ($m) use (&$parameters) {
                        return isset($parameters[$m[1]]) ? array_pull($parameters, $m[1]) : $m[0];
                    }, $uri);
                    $uri = with(new UrlGenerator($app))->to($uri, []);
                    if (!$absolute) {
                        $root = $app->make('request')->root();
                        if (starts_with($uri, $root)) {
                            $uri = Str::substr($uri, Str::length($root));
                            if (empty($uri)) {
                                $uri = '/';
                            }
                        }
                    }
                    if (!empty($parameters)) {
                        $uri .= '?' . http_build_query($parameters);
                    }
                    return $uri;
                }
            }
        }
        throw new InvalidArgumentException("Action {$name} not defined.");
    }
}

if (!function_exists('app_with')) {
    /**
     * Get the available container instance.
     *
     * @param string $abstract
     * @param array $parameters
     *
     * @return mixed|Application
     */
    function app_with($abstract = null, array $parameters = [])
    {
        /** @var Application $app */
        $app = Application::getInstance();
        if (is_null($abstract)) {
            return $app;
        }
        if (method_exists($app, 'makeWith')) {
            return empty($parameters)
                ? $app->make($abstract)
                : $app->makeWith($abstract, $parameters);
        } else {
            return $app->make($abstract, $parameters);
        }
    }
}

if (!function_exists('asset')) {
    /**
     * Generate an asset path for the application.
     *
     * @param string $path
     * @param bool $secure
     *
     * @return string
     */
    function asset($path, $secure = null)
    {
        return (new UrlGenerator(app()))->to($path, null, $secure);
    }
}

if (!function_exists('back')) {
    /**
     * Create a new redirect response to the previous location.
     *
     * @param int $status
     * @param array $headers
     * @param mixed $fallback
     *
     * @return RedirectResponse
     */
    function back($status = 302, $headers = [], $fallback = false)
    {
        return redirect()->back($status, $headers, $fallback);
    }
}

if (!function_exists('cache')) {
    /**
     * Get / set the specified cache value.
     *
     * If an array is passed, we'll assume you want to put to the cache.
     *
     * @param dynamic key|key,default|data,expiration|null
     *
     * @return mixed
     *
     * @throws \Exception
     */
    function cache()
    {
        $arguments = func_get_args();
        if (empty($arguments)) {
            return app('cache');
        }
        if (is_string($arguments[0])) {
            return app('cache')->get($arguments[0], isset($arguments[1]) ? $arguments[1] : null);
        }
        if (!is_array($arguments[0])) {
            throw new Exception(
                'When setting a value in the cache, you must pass an array of key / value pairs.'
            );
        }
        if (!isset($arguments[1])) {
            throw new Exception(
                'You must specify an expiration time when setting a value in the cache.'
            );
        }
        return app('cache')->put(key($arguments[0]), reset($arguments[0]), $arguments[1]);
    }
}

if (!function_exists('logger')) {
    /**
     * Log a debug message to the logs.
     *
     * @param null $message
     * @param array $context
     *
     * @return Log|null
     */
    function logger($message = null, array $context = [])
    {
        if (is_null($message)) {
            return app('log');
        }
        return app('log')->debug($message, $context);
    }
}

if (!function_exists('method_field')) {
    /**
     * Generate a form field to spoof the HTTP verb used by forms.
     *
     * @param $method
     *
     * @return HtmlString
     */
    function method_field($method)
    {
        return new HtmlString('<input type="hidden" name="_method" value="' . $method . '" />');
    }
}

if (!function_exists('validator')) {
    /**
     * Create a new Validator instance.
     *
     * @param  array $data
     * @param  array $rules
     * @param  array $messages
     * @param  array $customAttributes
     *
     * @return Validator|ValidationFactory
     */
    function validator(array $data = [], array $rules = [], array $messages = [], array $customAttributes = [])
    {
        /** @var ValidationFactory $factory */
        $factory = app(ValidationFactory::class);
        if (func_num_args() === 0) {
            return $factory;
        }
        return $factory->make($data, $rules, $messages, $customAttributes);
    }
}

if (! function_exists('request')) {
    /**
     * Get an instance of the current request or an input item from the request.
     *
     * @param  array|string  $key
     * @param  mixed   $default
     * @return \Illuminate\Http\Request|string|array
     */
    function request($key = null, $default = null)
    {
        if (is_null($key)) {
            return app('request');
        }

        if (is_array($key)) {
            return app('request')->only($key);
        }

        $value = app('request')->__get($key);

        return is_null($value) ? value($default) : $value;
    }
}

function getLoggedInUserId()
{
    return request()->user()->token()->user_id;
}

function getLoggedInUser()
{
    return request()->user()->token();
}

/**
 * Get an image and path for image upload.
 *
 * @param  object  $image
 * @param  string  $path
 * @return string
 */
function imageUpload($image, $path)
{
    directoryObserver($path);
    $fullPath = public_path() . $path;
    $original_filename     = $image->getClientOriginalName();
    $original_filename_arr = explode('.', $original_filename);
    $file_ext              = end($original_filename_arr);
    $imageName             = time() . '.' . $file_ext;
    $image->move($fullPath, $imageName);
    return $imageName;
}

/**
 * Get an folder path if not exist create new.
 *
 * @param  string  $destinationPath
 * @return void
 */
function directoryObserver($destinationPath)
{
    $path = public_path();
    foreach (explode('/', $destinationPath) as $directory) {
        $path .= '/' . $directory;
        if (!File::isDirectory($path)) {
            File::makeDirectory($path, $mode = 0755, true, true);
        }
    }
}

function setEmailConfigurations($accountId)
{
    $emailConfigData = EmailConfiguration::Where('id', $accountId)->first();
    if (isset($emailConfigData)) {
        $configuration = EmailConfiguration::where("account_id", $accountId)->first();
        if (!is_null($configuration)) {
            // $config = array(
            //     'mail.mailers.smtp.transport'  =>     $configuration->driver,
            //     'mail.mailers.smtp.host'       =>     $configuration->host,
            //     'mail.mailers.smtp.port'       =>     $configuration->port,
            //     'mail.mailers.smtp.username'   =>     $configuration->username,
            //     'mail.mailers.smtp.password'   =>     $configuration->password,
            //     'mail.mailers.smtp.encryption' =>     $configuration->encryption,
            //     'from'       =>     array(
            //                             'from.address' => $configuration->sender_email,
            //                             'from.name'    => $configuration->sender_name),
            // );
            Config::set('mail.mailers.smtp.transport', $configuration->driver);
            Config::set('mail.mailers.smtp.host', $configuration->host);
            Config::set('mail.mailers.smtp.port', $configuration->port);
            Config::set('mail.mailers.smtp.username', $configuration->username);
            Config::set('mail.mailers.smtp.password', $configuration->password);
            Config::set('mail.mailers.smtp.encryption', $configuration->encryption);
            Config::set('mail.from.address', $configuration->sender_email);
            Config::set('mail.from.name', $configuration->sender_name);
            // Config::set('mail', $config);
        }
    }
}

/**
 * PHP random password generator
 * contains at least one lower case letter, one upper case letter, one number and one special character
 *
 * @return string $password
 */
function randomPassword()
{
    //enforce min length 8
    $len = 8;

    //define character libraries - remove ambiguous characters like iIl|1 0oO
    $sets = array();
    $sets[] = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    $sets[] = 'abcdefghjkmnpqrstuvwxyz';
    $sets[] = '123456789';
    $sets[]  = '#?!@$%^&*-';

    $password = '';
    
    //append a character from each set - gets first 4 characters
    foreach ($sets as $set) {
        $password .= $set[array_rand(str_split($set))];
    }

    //use all characters to fill up to $len
    while (strlen($password) < $len) {
        //get a random set
        $randomSet = $sets[array_rand($sets)];
        
        //add a random char from the random set
        $password .= $randomSet[array_rand(str_split($randomSet))];
    }
    
    //shuffle the password string before returning!
    return str_shuffle($password);
}
