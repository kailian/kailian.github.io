---
layout: post
category : web
title: 'laravel异步任务调用'
tagline: ""
tags : [web]
---

## 队列

> 队列允许你将一个耗时的任务进行延迟处理，让应用程序对页面的请求有更快的响应。

## laravel异步队列调用

[laravel 队列文档](https://learnku.com/docs/laravel/5.4/queues/1256)

版本：laravel版本 5.4，队列使用Redis

配置文件config/queue.php


### 队列执行过程

php artisan queue:work

vendor/laravel/framework/src/Illuminate/Queue/Console/WorkCommand.php

```
protected function runWorker($connection, $queue)
{
    $this->worker->setCache($this->laravel['cache']->driver());

    return $this->worker->{$this->option('once') ? 'runNextJob' : 'daemon'}(
        $connection, $queue, $this->gatherWorkerOptions()
    );
}
```

<!--break-->

daemon的方式

vendor/laravel/framework/src/Illuminate/Queue/Worker.php

```
public function daemon($connectionName, $queue, WorkerOptions $options)
{
    $this->listenForSignals();

    $lastRestart = $this->getTimestampOfLastQueueRestart();

    while (true) {
        // Before reserving any jobs, we will make sure this queue is not paused and
        // if it is we will just pause this worker for a given amount of time and
        // make sure we do not need to kill this worker process off completely.
        if (! $this->daemonShouldRun($options)) {
            $this->pauseWorker($options, $lastRestart);

            continue;
        }

        // First, we will attempt to get the next job off of the queue. We will also
        // register the timeout handler and reset the alarm for this job so it is
        // not stuck in a frozen state forever. Then, we can fire off this job.
        $job = $this->getNextJob(
            $this->manager->connection($connectionName), $queue
        );

        $this->registerTimeoutHandler($job, $options);

        // If the daemon should run (not in maintenance mode, etc.), then we can run
        // fire off this job for processing. Otherwise, we will need to sleep the
        // worker so no more jobs are processed until they should be processed.
        if ($job) {
            $this->runJob($job, $connectionName, $options);
        } else {
            $this->sleep($options->sleep);
        }

        // Finally, we will check to see if we have exceeded our memory limits or if
        // the queue should restart based on other indications. If so, we'll stop
        // this worker and let whatever is "monitoring" it restart the process.
        $this->stopIfNecessary($options, $lastRestart);
    }
}
```

getNextJob，从redis取出队列任务，，获取任务后runJob，没有任务就sleep

```
 protected function runJob($job, $connectionName, WorkerOptions $options)
{
    try {
        return $this->process($connectionName, $job, $options);
    } catch (Exception $e) {
        $this->exceptions->report($e);

        $this->stopWorkerIfLostConnection($e);
    } catch (Throwable $e) {
        $this->exceptions->report($e = new FatalThrowableError($e));

        $this->stopWorkerIfLostConnection($e);
    }
}
```

```
public function process($connectionName, $job, WorkerOptions $options)
{
    try {
        // First we will raise the before job event and determine if the job has already ran
        // over the its maximum attempt limit, which could primarily happen if the job is
        // continually timing out and not actually throwing any exceptions from itself.
        $this->raiseBeforeJobEvent($connectionName, $job);

        $this->markJobAsFailedIfAlreadyExceedsMaxAttempts(
            $connectionName, $job, (int) $options->maxTries
        );

        // Here we will fire off the job and let it process. We will catch any exceptions so
        // they can be reported to the developers logs, etc. Once the job is finished the
        // proper events will be fired to let any listeners know this job has finished.
        $job->fire();

        $this->raiseAfterJobEvent($connectionName, $job);
    } catch (Exception $e) {
        $this->handleJobException($connectionName, $job, $options, $e);
    } catch (Throwable $e) {
        $this->handleJobException(
            $connectionName, $job, $options, new FatalThrowableError($e)
        );
    }
}
```

vendor/laravel/framework/src/Illuminate/Queue/Jobs/Job.php

```
public function fire()
{
    $payload = $this->payload();

    list($class, $method) = JobName::parse($payload['job']);

    with($this->instance = $this->resolve($class))->{$method}($this, $payload['data']);
}
```

获取任务的类和方法

vendor/laravel/framework/src/Illuminate/Queue/Jobs/JobName.php

```
protected function resolve($class)
{
    return $this->container->make($class);
}
```

vendor/laravel/framework/src/Illuminate/Container/Container.php

```
public function make($abstract)
{
    return $this->resolve($abstract);
}
```

```
protected function resolve($abstract, $parameters = [])
{
    $abstract = $this->getAlias($abstract);

    $needsContextualBuild = ! empty($parameters) || ! is_null(
        $this->getContextualConcrete($abstract)
    );

    // If an instance of the type is currently being managed as a singleton we'll
    // just return an existing instance instead of instantiating new instances
    // so the developer can keep using the same objects instance every time.
    if (isset($this->instances[$abstract]) && ! $needsContextualBuild) {
        return $this->instances[$abstract];
    }

    $this->with[] = $parameters;

    $concrete = $this->getConcrete($abstract);

    // We're ready to instantiate an instance of the concrete type registered for
    // the binding. This will instantiate the types, as well as resolve any of
    // its "nested" dependencies recursively until all have gotten resolved.
    if ($this->isBuildable($concrete, $abstract)) {
        $object = $this->build($concrete);
    } else {
        $object = $this->make($concrete);
    }

    // If we defined any extenders for this type, we'll need to spin through them
    // and apply them to the object being built. This allows for the extension
    // of services, such as changing configuration or decorating the object.
    foreach ($this->getExtenders($abstract) as $extender) {
        $object = $extender($object, $this);
    }

    // If the requested type is registered as a singleton we'll want to cache off
    // the instances in "memory" so we can return it later without creating an
    // entirely new instance of an object on each subsequent request for it.
    if ($this->isShared($abstract) && ! $needsContextualBuild) {
        $this->instances[$abstract] = $object;
    }

    $this->fireResolvingCallbacks($abstract, $object);

    // Before returning, we will also set the resolved flag to "true" and pop off
    // the parameter overrides for this build. After those two things are done
    // we will be ready to return back the fully constructed class instance.
    $this->resolved[$abstract] = true;

    array_pop($this->with);

    return $object;
}
```

### 跟踪worker队列执行

mac使用dtruss，linux使用strace，跟踪程序执行时进程系统调用(system call)和所接收的信号

```
sudo dtruss php artisan queue:work redis --queue=default --sleep=3 --timeout=180
strace php artisan queue:work redis --queue=default --sleep=3 --timeout=180
```

```
Processing: App\Jobs\CacheJob
../laravel/framework/src/Illuminate/Queue/Jobs/RedisJob.php
../laravel/framework/src/Illuminate/Queue/Jobs/Job.php
../laravel/framework/src/Illuminate/Contracts/Queue/Job.php
../laravel/framework/src/Illuminate/Queue/Events/JobProcessing.php
../laravel/framework/src/Illuminate/Queue/Jobs/JobName.php
../laravel/framework/src/Illuminate/Queue/CallQueuedHandler.php
../laravel/framework/src/Illuminate/Contracts/Bus/Dispatcher.php
../laravel/framework/src/Illuminate/Bus/Dispatcher.php
../laravel/framework/src/Illuminate/Contracts/Bus/QueueingDispatcher.php
../laravel/framework/src/Illuminate/Pipeline/Pipeline.php
../laravel/framework/src/Illuminate/Contracts/Pipeline/Pipeline.php
../../app/Jobs/CacheJob.php
```

执行一个队列任务后可以看到调用的文件，内容较多，只截取一部分

## redis 查询

查询队列任务数

- queue:default // 存储未处理任务
- queue:default:delayed // 存储延迟任务
- queue:default:reserved // 存储待处理任务

```
redis-cli -h 127.0.0.1 -p 6379 -a `awk '/^requirepass/ {print $2}' /etc/redis.conf` -n 1 llen queues:default
```

## 参考资料

- [Laravel 之队列使用浅析](https://learnku.com/articles/4479/analysis-of-laravel-queue-usage)
- [Laravel 的消息队列剖析](https://learnku.com/articles/4169/analysis-of-laravel-message-queue)
