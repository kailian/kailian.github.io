---
layout: post
category : bigdata
title: 'Flink Broadcast State'
tagline: ""
tags : [bigdata]
---

### 广播流

广播流可以通过查询配置文件，广播到某个 operator 的所有并发实例中，然后与另一条流数据连接进行计算。
广播的数据结构

- 使用广播状态，operator task 之间不会相互通信。使用广播流，实现数据流的动态配置（taskSlot是内存隔离的，所以broadcast是在Taskslot都有一份）。
- 广播状态中事件的顺序在各个任务之间可能有所不同
- 所有任务都会检查其广播状态
- 没有RocksDB状态后端

<!--break-->

### 广播状态模式的应用

1、动态规则：动态规则是一条事件流，要求吞吐量不能太高。例如，当一个报警规则时触发报警信息等。我们将这个规则广播到计算的算子的所有并发实例中。业务上使用广播通知表结构变化，更新表结构元数据。

broadcast的使用步骤

1. 定义广播状态描述，广播规则，建立MapStateDescriptor
2. 进行广播，通过DataStream.broadcast方法返回广播数据流BroadcastStream
3. 使用BroadcastStream，对广播的数据进行关联，通过DataStream.connect方法，把业务数据流和BroadcastStream进行连接，返回BroadcastConnectedStream
4. 通过BroadcastConnectedStream.process方法分别进行processElement及processBroadcastElement处理

MapStateDescriptor

```
MapStateDescriptor<String, String> configRule = new MapStateDescriptor<String, String>("configRule", BasicTypeInfo.STRING_TYPE_INFO, BasicTypeInfo.STRING_TYPE_INFO);
```


```
SingleOutputStreamOperator<McLog> resLog = logs.connect(configLogs.broadcast(CONFIG_TYPE_MAP)).process(new BroadcastProcessFunction<McLog, ConfigLog, McLog>() {
    @Override
    public void processElement(McLog mcLog, ReadOnlyContext readOnlyContext, Collector<McLog> out) throws Exception {
        ReadOnlyBroadcastState<String, ConfigLog> broadcastState =
                readOnlyContext.getBroadcastState(CONFIG_TYPE_MAP);
        ...
        out.collect(mcLog);
    }

    @Override
    public void processBroadcastElement(ConfigLog configLog, Context ctx, Collector<McLog> out) throws Exception {
        BroadcastState<String, ConfigLog> broadcastState =
                ctx.getBroadcastState(CONFIG_TYPE_MAP);
        ...
        broadcastState.put(configLog.getLogName(), configLog);
    }
});
```

重写

1. processElement，处理业务数据流（只读broadcastState）
2. processBroadcastElement，处理广播数据流（读写broadcastState）

Broadcast State

Broadcast State始终表示为MapState，即map format。广播变量就是OperatorState的一部分，是以托管状态的MapState形式保存的。具体getBroadcastState函数就是DefaultOperatorStateBackend中的实现

### 资料

流作业中的广播变量和BroadcastState
https://blog.csdn.net/weixin_42155491/article/details/104886884

从实例和源码入手看 Flink 之广播 Broadcast
https://blog.csdn.net/weixin_47364682/article/details/106149996