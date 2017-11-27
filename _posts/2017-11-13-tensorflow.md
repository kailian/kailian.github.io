---
layout: post
category : machine learning
title: 'TensorFlow'
tagline: ""
tags : [machine learning]
---

## 写在前面

这个只是简化版笔记，详细信息请参考官网。

## TensorFlow

TensorFlow的主要数据单元是张量

```
[1., 2., 3.] # a rank 1 tensor; a vector with shape [3] 一维矢量
[[1., 2., 3.], [4., 5., 6.]] # a rank 2 tensor; a matrix with shape [2, 3] 二维矩阵
[[[1., 2., 3.]], [[7., 8., 9.]]] # a rank 3 tensor with shape [2, 1, 3] 三维以上都称为张量
```

<!--break-->

- [get start](https://www.tensorflow.org/get_started/)
- [tensorflow](https://github.com/tensorflow/tensorflow)
- [tensorflow-zh](https://github.com/jikexueyuanwiki/tensorflow-zh)

## install

[tensorflow install](https://www.tensorflow.org/install/)

配置为国内镜像源

```
修改 ~/.pip/pip.conf (没有就创建一个)， 内容如下：
[global]
index-url = http://mirrors.aliyun.com/pypi/simple/
```

```
sudo easy_install --upgrade pip
sudo pip install tensorflow
```

TensorFlow在运行会有一些系统配置的提示（警告），配置日志等级可以忽略提示

```
import os
os.environ['TF_CPP_MIN_LOG_LEVEL']='2'
import tensorflow as tf
```

## demo

### hello world

```
>>> import tensorflow as tf
>>> hello = tf.constant('Hello, TensorFlow!')
>>> sess = tf.Session()
>>> sess.run(hello)
'Hello, TensorFlow!'
>>> a = tf.constant(10)
>>> b = tf.constant(32)
>>> sess.run(a + b)
42
>>> sess.close()
```

### 线性函数

```
import os
import tensorflow as tf

os.environ['TF_CPP_MIN_LOG_LEVEL']='2'

# Model parameters
W = tf.Variable([.3], dtype=tf.float32)
b = tf.Variable([-.3], dtype=tf.float32)
# Model input and output
x = tf.placeholder(tf.float32)
linear_model = W*x + b
y = tf.placeholder(tf.float32)

# loss
loss = tf.reduce_sum(tf.square(linear_model - y)) # sum of the squares
# optimizer
optimizer = tf.train.GradientDescentOptimizer(0.01)
train = optimizer.minimize(loss)

# training data
x_train = [1, 2, 3, 4]
y_train = [0, -1, -2, -3]
# training loop
init = tf.global_variables_initializer()
sess = tf.Session()
sess.run(init) # reset values to wrong
for i in range(1000):
      sess.run(train, {x: x_train, y: y_train})

# evaluate training accuracy
curr_W, curr_b, curr_loss = sess.run([W, b, loss], {x: x_train, y: y_train})
print("W: %s b: %s loss: %s"%(curr_W, curr_b, curr_loss))
```

```
W: [-0.9999969] b: [ 0.99999082] loss: 5.69997e-11
```

误差是非常小的数，接近于0

训练集

```
x = [1, 2, 3, 4]
y = [0, -1, -2, -3]
y = -x + 1
```

### MNIST

#### MNIST

MNIST是一个简单计算机视觉数据库，包括一些手写数字。[MNIST](http://yann.lecun.com/exdb/mnist/)数据库下载。[mnist_softmax.py](https://github.com/tensorflow/tensorflow/blob/r1.4/tensorflow/examples/tutorials/mnist/mnist_softmax.py)源码。

![MNIST](/images/201711/MNIST.png)

通过训练模型（回归分析）去查找图片并预测图片是什么数字例子理解TensorFlow是如何工作和机器学习的核心概念。

每张图片为28pix * 28pix，可以转化为28x28 = 784的张量

![MNIST-Matrix](/images/201711/MNIST-Matrix.png)

MNIST data分为3个部分

- 训练数据(mnist.train)，55,000
- 测试数据(mnist.test)，10,000
- 验证数据(mnist.validation)，5,000

每个MNIST数据样本包括手写数字和对应的标签（手写体图片对应0-9的数字），称为images “x”和 labels "y"

mnist.train.images是大小为[55000, 784]的张量（N维数组）

![mnist-train-xs](/images/201711/mnist-train-xs.png)

第一个坐标轴是图片集记录的索引，第二个坐标轴是每张图片里每个像素点的索引，每个输入是0或1的像素张量（特定图片的特定像素）


使用[One-hot](https://en.wikipedia.org/wiki/One-hot)编码表示数字标签，例如：3对应[0001000000]

mnist.train.labels是一个[55000, 10]的浮点数数组

![mnist-train-ys](/images/201711/mnist-train-ys.png)

#### Softmax回归

回归分析（Softmax Regressions）是确定两种或两种以上变量间相互依赖的定量关系的一种统计分析方法。

每个手写数字都在0-9之间，每张的值一个有10种可能性。我们想查找图片并给出正确的标签。我们的模型并不是100%正确的。例如，查找图片为9的概率为80%，5%为8，剩下为其他。

回归分析提供一组在0-1之间的数，并且这些数的和为1

回归分析两个步骤:

1. 我们将输入的证据添加到某些类中
2. 然后将证据转换为概率。

对象素强度加权求和，如果该像素具有高强度是对该类图像的证据，那么如果该证据是有利的，则该权重是负的。

红色表示负权重，蓝色表示正权重。

![softmax-weights](/images/201711/softmax-weights.png)

我们还添加了额外的证据称为偏差，有些因素更可能独立于输入。

x的证据

<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <msub>
    <mtext>evidence</mtext>
    <mi>i</mi>
  </msub>
  <mo>=</mo>
  <munder>
    <mo>&#x2211;<!-- ∑ --></mo>
    <mi>j</mi>
  </munder>
  <msub>
    <mi>W</mi>
    <mrow class="MJX-TeXAtom-ORD">
      <mi>i</mi>
      <mo>,</mo>
      <mtext>&#xA0;</mtext>
      <mi>j</mi>
    </mrow>
  </msub>
  <msub>
    <mi>x</mi>
    <mi>j</mi>
  </msub>
  <mo>+</mo>
  <msub>
    <mi>b</mi>
    <mi>i</mi>
  </msub>
</math>

W为权重，b为偏差

<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mi>y</mi>
  <mo>=</mo>
  <mtext>softmax</mtext>
  <mo stretchy="false">(</mo>
  <mtext>evidence</mtext>
  <mo stretchy="false">)</mo>
</math>

回归在这里作为一个“激活”或“连接”的函数，在这个例子，会分成超过10例的概率分布，将证据的一致性转化为每个类中输入的概率

<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mtext>softmax</mtext>
  <mo stretchy="false">(</mo>
  <mi>e</mi>
  <mi>v</mi>
  <mi>i</mi>
  <mi>d</mi>
  <mi>e</mi>
  <mi>n</mi>
  <mi>c</mi>
  <mi>e</mi>
  <mo stretchy="false">)</mo>
  <mo>=</mo>
  <mtext>normalize</mtext>
  <mo stretchy="false">(</mo>
  <mi>exp</mi>
  <mo>&#x2061;<!-- ⁡ --></mo>
  <mo stretchy="false">(</mo>
  <mi>e</mi>
  <mi>v</mi>
  <mi>i</mi>
  <mi>d</mi>
  <mi>e</mi>
  <mi>n</mi>
  <mi>c</mi>
  <mi>e</mi>
  <mo stretchy="false">)</mo>
  <mo stretchy="false">)</mo>
</math>

展开表示

<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mtext>softmax</mtext>
  <mo stretchy="false">(</mo>
  <mi>e</mi>
  <mi>v</mi>
  <mi>i</mi>
  <mi>d</mi>
  <mi>e</mi>
  <mi>n</mi>
  <mi>c</mi>
  <mi>e</mi>
  <msub>
    <mo stretchy="false">)</mo>
    <mi>i</mi>
  </msub>
  <mo>=</mo>
  <mfrac>
    <mrow>
      <mi>exp</mi>
      <mo>&#x2061;<!-- ⁡ --></mo>
      <mo stretchy="false">(</mo>
      <mi>e</mi>
      <mi>v</mi>
      <mi>i</mi>
      <mi>d</mi>
      <mi>e</mi>
      <mi>n</mi>
      <mi>c</mi>
      <msub>
        <mi>e</mi>
        <mi>i</mi>
      </msub>
      <mo stretchy="false">)</mo>
    </mrow>
    <mrow>
      <munder>
        <mo>&#x2211;<!-- ∑ --></mo>
        <mi>j</mi>
      </munder>
      <mi>exp</mi>
      <mo>&#x2061;<!-- ⁡ --></mo>
      <mo stretchy="false">(</mo>
      <mi>e</mi>
      <mi>v</mi>
      <mi>i</mi>
      <mi>d</mi>
      <mi>e</mi>
      <mi>n</mi>
      <mi>c</mi>
      <msub>
        <mi>e</mi>
        <mi>j</mi>
      </msub>
      <mo stretchy="false">)</mo>
    </mrow>
  </mfrac>
</math>

回归分析看起来像下图，虽然有多个输入xi，对每个输出，我们计算xs的加权求和，加上偏差，然后应用回归

![softmax-regression-scalargraph](/images/201711/softmax-regression-scalargraph.png)

用方程表示

![softmax-regression-scalarequation](/images/201711/softmax-regression-scalarequation.png)

将方程转换为矩阵相乘和相加（方便更有效地计算）

![softmax-regression-vectorequation](/images/201711/softmax-regression-vectorequation.png)

<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mi>y</mi>
  <mo>=</mo>
  <mtext>softmax</mtext>
  <mo stretchy="false">(</mo>
  <mi>W</mi>
  <mi>x</mi>
  <mo>+</mo>
  <mi>b</mi>
  <mo stretchy="false">)</mo>
</math>

#### 回归模型

使用NumPy处理矩阵相乘，模型表示

```
import tensorflow as tf
x = tf.placeholder(tf.float32, [None, 784])
W = tf.Variable(tf.zeros([784, 10]))
b = tf.Variable(tf.zeros([10]))
y = tf.nn.softmax(tf.matmul(x, W) + b)
```

#### 训练

为了训练模型，我们要定义什么样的模型是好的。成本或损失，它表示我们的模型离我们期望的结果有多远。我们尽量减小错误，误差越小，我们的模型就越好。

交叉熵

<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <msub>
    <mi>H</mi>
    <mrow class="MJX-TeXAtom-ORD">
      <msup>
        <mi>y</mi>
        <mo>&#x2032;</mo>
      </msup>
    </mrow>
  </msub>
  <mo stretchy="false">(</mo>
  <mi>y</mi>
  <mo stretchy="false">)</mo>
  <mo>=</mo>
  <mo>&#x2212;<!-- − --></mo>
  <munder>
    <mo>&#x2211;<!-- ∑ --></mo>
    <mi>i</mi>
  </munder>
  <msubsup>
    <mi>y</mi>
    <mi>i</mi>
    <mo>&#x2032;</mo>
  </msubsup>
  <mi>log</mi>
  <mo>&#x2061;<!-- ⁡ --></mo>
  <mo stretchy="false">(</mo>
  <msub>
    <mi>y</mi>
    <mi>i</mi>
  </msub>
  <mo stretchy="false">)</mo>
</math>

y是预测的概率分布，y_ 是真正的分布（one-hot向量表示的数字标签）

```
y_ = tf.placeholder(tf.float32, [None, 10])
cross_entropy = tf.reduce_mean(-tf.reduce_sum(y_ * tf.log(y), reduction_indices=[1]))
train_step = tf.train.GradientDescentOptimizer(0.5).minimize(cross_entropy)
sess = tf.InteractiveSession()
tf.global_variables_initializer().run()

for _ in range(1000):
  batch_xs, batch_ys = mnist.train.next_batch(100)
  sess.run(train_step, feed_dict={x: batch_xs, y_: batch_ys})
```

#### 运行模型

```
correct_prediction = tf.equal(tf.argmax(y,1), tf.argmax(y_,1))
accuracy = tf.reduce_mean(tf.cast(correct_prediction, tf.float32))
print(sess.run(accuracy, feed_dict={x: mnist.test.images, y_: mnist.test.labels}))
```

结果：0.9166