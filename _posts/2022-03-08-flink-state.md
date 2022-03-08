---
layout: post
category : bigdata
title: ''
tagline: "Flink State"
tags : [bigdata]
---

### 问题

1. 什么是状态？状态有什么作用？
2. Flink状态类型有哪几种？
3. State Backends？
4. 什么是checkpoint与savepoint？
5. 如何使用checkpoint与savepoint？
6. checkpoint原理是什么？
7. checkpoint API

<!--break-->

### 什么是state？状态有什么作用？

state是Flink程序某个时刻某个task/operator的状态，state数据是程序运行中某一时刻数据结果，这个state数据会保存在taskmanager的内存中，也就是java的堆内存中。官方推荐使用先存储到本地的RocksDB中，然后再将RocksDB中的状态数据异步checkpoint到hdfs上。

单个state的大小默认值为5MB，可以在MemoryStateBackend的构造函数中增加。无论如何配置，State大小都无法大于akka.framesize(JobManager和TaskManager之间发送的最大消息的大小，默认是10MB)。JobManager必须有足够的内存。

State vs checkpoint

首先区分一下两个概念，state一般指一个具体的task/operator的状态。而checkpoint则表示了一个Flink Job，在一个特定时刻的一份全局状态快照，即包含了所有task/operator的状态。Flink通过定期地做checkpoint来实现容错和恢复。

### Flink状态类型有哪几种？

State类型

2个基本状态

1. Keyed State Keyed State 通常和 key 相关，仅可使用在 KeyedStream 的方法和算子中。Keyed State 会按照 Key Group 进行管理。Key Group 是 Flink 分发 Keyed State 的最小单元； Key Group 的数目等于作业的最大并发数。在执行过程中，每个 keyed operator 会对应到一个或多个 Key Group
2. Operator State 对于 Operator State (或者 non-keyed state) 来说，每个 operator state 和一个并发实例进行绑定。在一个operator上，可能会有很多个key，从而对应多个keyed state。 Kafka Connector 是 Flink 中使用 operator state 的一个很好的示例。 每个 Kafka 消费者的并发在 Operator State 中维护一个 topic partition 到 offset 的映射关系。

Raw State 原始状态 & Managed State 托管状态

1. Raw State
2. Managed State

Keyed State 和 Operator State 分别有两种存在形式：managed and raw。

Managed State 由 Flink 运行时控制的数据结构表示，比如内部的 hash table 或者 RocksDB。

Raw State 由用户自行管理状态具体的数据结构，保存在算子自己的数据结构中。checkpoint 的时候，Flink 并不知晓具体的内容，仅仅写入一串字节序列到 checkpoint。托管状态是由 Flink框架运行时 管理的状态，比如内部的 hash table 或者 RocksDB。 比如 ValueState, ListState 等。Flink runtime 会对这些状态进行编码并写入 checkpoint。

Broadcast State

### State Backends

三种State Backends

- MemoryStateBackend 默认，小状态，本地调试使用
- FsStateBackend 大状态，长窗口，高可用场景
- RocksDBStateBackend 超大状态，长窗口，高可用场景，可增量checkpoint

MemoryStateBackend的局限性

- 单个状态的大小默认情况下最大为5MB。这个值可以通过MemoryStateBackend构造函数进行增加
- 无论配置的最大状态大小为多少，状态的大小不能超过akka帧大小
- 聚合的状态必须在JobManager的内存中能存放


FsStateBackend需要配置存储的文件系统，可以是hdfs路径，也可以是文件系统路径。

FsStateBackend默认使用异步快照，对每个快照文件大小有要求:[0, 1048576]，且状态快照大小不能超过 TaskManager 的内存。但状态快照最终保存在文件系统中，所以FsStateBackend适用于大数据的生产环境，可处理长窗口，大状态或大key-value状态任务。

默认情况下，FsStateBackend 配置成提供异步快照，以避免在状态 checkpoint 时阻塞数据流的处理。

RocksDBStateBackend 使用文件系统URL(类型，地址，路径)

RocksDB支持的单key和单value的大小最大为每个 2^31 字节。 这是因为 RocksDB 的 JNI API 是基于byte[]的。
对于使用具有合并操作的状态的应用程序，例如 ListState，随着时间可能会累积到超过 2^31 字节大小，这将会导致在接下来的查询中失败。

RocksDBStateBackend是目前唯一提供增量checkpoint的状态后端。

状态保存在数据库RocksDB中，相比其他状态后端可保存更大的状态，但开销更大（读/写需要反序列化/序列化去检索/存储状态)。

目前只有RocksDBStateBackend支持增量checkpoint（默认全量）,false默认全量，true代表增量。

三种State Backends | 你该用哪个？

https://blog.csdn.net/run_bigdata/article/details/102493568

### 什么是checkpoint？

Checkpoint 将正在运行的任务的状态保存下来。这个状态包括任务中每个算子的state，缓存的数据等。当flink的任务或者机器挂掉了，重新启动任务时需要将任务恢复到原来的状态。

Checkpoint 在默认的情况下仅用于恢复失败的作业，并不保留，当程序取消时 checkpoint 就会被删除。通过配置来保留 checkpoint，这些被保留的 checkpoint 在作业失败或取消时不会被清除。

CheckpointConfig config = env.getCheckpointConfig();
config.enableExternalizedCheckpoints(ExternalizedCheckpointCleanup.RETAIN_ON_CANCELLATION);

checkpoint 由元数据文件、数据文件（与 state backend 相关）组成。

```
/user-defined-checkpoint-dir
    /{job-id}
        |
        + --shared/
        + --taskowned/
        + --chk-1/
        + --chk-2/
        + --chk-3/
        ...
```

SHARED 目录保存了可能被多个 checkpoint 引用的文件，TASKOWNED 保存了不会被 JobManager 删除的文件，EXCLUSIVE 则保存那些仅被单个 checkpoint 引用的文件。

checkpoint是要把state数据持久化存储起来，checkpoint默认情况下会存储在JoManager的内存中。checkpoint表示一个Flink job在一个特定时刻的一份全局状态快照，方便在任务失败的情况下数据的恢复。

### 什么是savepoint？

Savepoint 是依据 Flink checkpointing 机制所创建的流作业执行状态的一致镜像。使用 Savepoint 进行 Flink 作业的停止与重启、fork 或者更新。

### Checkpoint 与 Savepoint 的区别？

- Checkpoint使用 state backend 特定的数据格式，可能以增量方式存储
- Checkpoint不支持 Flink 的特定功能，比如扩缩容

从概念上讲， Flink 的 Savepoint 与 Checkpoint 的不同之处类似于传统数据库中的备份与恢复日志之间的差异。 Checkpoint 的主要目的是为意外失败的作业提供恢复机制。 Checkpoint 的生命周期由 Flink 管理，即 Flink 创建，管理和删除 Checkpoint，无需用户交互。 作为一种恢复和定期触发的方法，Checkpoint 实现有两个设计目标：i）轻量级创建和 ii）尽可能快地恢复。

Savepoint 由用户创建，拥有和删除。 他们的用例是计划的，手动备份和恢复。 例如，升级 Flink 版本，调整用户逻辑，改变并行度，以及进行红蓝部署等。

当触发 Savepoint 时，将创建一个新的 Savepoint 目录，其中存储数据和元数据。

```
flink savepoint :jobId [:targetDirectory]
```

触发 ID 为 :jobId 的作业的 Savepoint，并返回创建的 Savepoint 路径。 你需要此路径来还原和删除 Savepoint 。

```
flink savepoint :jobId [:targetDirectory] -yid :yarnAppId
```

将触发 ID 为 :jobId 和 YARN 应用程序 ID :yarnAppId 的作业的 Savepoint，并返回创建的 Savepoint 的路径

```
flink cancel -s [:targetDirectory] :jobId
```

自动触发 ID 为 :jobid 的作业的 Savepoint，并取消该作业。

从 Savepoint 恢复

```
flink run -s :savepointPath [:runArgs]
```
删除 Savepoint

```
flink savepoint -d :savepointPath
```

### checkpoint原理是什么？

https://www.jianshu.com/p/c32ee7c2384e

Flink Checkpoint原理解析

https://zhuanlan.zhihu.com/p/144876828

Checkpoint 原理解析与应用实践

https://developer.aliyun.com/

### API

api docs 

https://nightlies.apache.org/flink/flink-docs-release-1.2/api/java/org/apache/flink/streaming/api/checkpoint/CheckpointedFunction.html

#### initializeState

在分布式执行期间创建转换函数的并行实例时调用。在parallel function初始化的时候(第一次初始化或者从前一次checkpoint recover的时候)被调用，通常用来初始化state，以及处理state recovery的逻辑。

#### snapshotState

每当Checkpoint获取转换函数的状态快照时，都会调用 。在此方法中，函数通常确保检查点数据结构（在初始化阶段获得）是最新的，以便拍摄快照。给定的快照上下文允许访问Checkpoint的元数据。此外，函数可以将此方法用作与外部系统刷新/提交/同步的钩子。

#### Example

```
public class MyFunction<T> implements MapFunction<T, T>, CheckpointedFunction {
    private ReducingState<Long> countPerKey;
    private ListState<Long> countPerPartition;

    private long localCount;

    public void initializeState(FunctionInitializationContext context) throws Exception {
        // get the state data structure for the per-key state
        countPerKey = context.getKeyedStateStore().getReducingState(
                new ReducingStateDescriptor<>("perKeyCount", new AddFunction<>(), Long.class));

        // get the state data structure for the per-key state
        countPerPartition = context.getOperatorStateStore().getOperatorState(
                new ListStateDescriptor<>("perPartitionCount", Long.class));

        // initialize the "local count variable" based on the operator state
        for (Long l : countPerPartition.get()) {
            localCount += l;
        }
    }

    public void snapshotState(FunctionSnapshotContext context) throws Exception {
        // the keyed state is always up to date anyways
        // just bring the per-partition state in shape
        countPerPartition.clear();
        countPerPartition.add(localCount);
    }

    public T map(T value) throws Exception {
        // update the states
        countPerKey.add(1L);
        localCount++;

        return value;
    }
}
```