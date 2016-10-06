---
layout: post
category : web
title: 'css-module'
tagline: ""
tags : [web,css]
---

## 什么是CSS Modules

> A CSS Module is a CSS file in which all class names and animation names are scoped locally by default. (CSS模块就是所有的类名都只有局部作用域的CSS文件)。

All URLs (url(...)) and @imports are in module request format (./xxx and ../xxx means relative, xxx and xxx/yyy means in modules folder, i. e. in node_modules).

### 大规模的css的问题

1. Global Namespace 全局命名空间

2. Dependencies 依赖

3. Dead Code Elimination 无用代码删除

4. Minification 压缩

5. Sharing Constants 共享常量

6. Non-deteministic Resolution 不确定分辨率

7. Isolation 作用域隔离

<!--break-->

CSS Modules将作用域限制于组件中，从而避免了全局作用域的问题。可以使用简单的类命令而不必担心污染全局作用域。在支持样式复用的同时，避免命名冲突。

## 工作原理

CSS Modules need to be piped in a build step. 需要构建才能使用，可以看成webpack的一个组件。

基本工作方式是：当你在一个JavaScript模块中导入一个CSS文件时（例如，在一个 React 组件中），CSS模块将会定义一个对象，将文件中类的名字动态的映射为JavaScript作用域中可以使用的字符串。

```
import styles from "./submit-button.css"

styles: {
  common: "components_submit_button__common__abc5436",
  normal: "components_submit_button__common__abc5436 components_submit_button__normal__def6547",
  error: "components_submit_button__common__abc5436 components_submit_button__error__1638bcd"
}
```

## CSS Modules特性

### Naming

button组件分别使用BEM Style和CSS Modules

BEM Style

```
/* components/submit-button.css */
.Button { /* all styles for Normal */ }
.Button--disabled { /* overrides for Disabled */ }
.Button--error { /* overrides for Error */ }
.Button--in-progress { /* overrides for In Progress */
```

```
<button class="Button Button--in-progress">Processing...</button>
```

With CSS Modules

```
/* components/submit-button.css */
.normal { /* all styles for Normal */ }
.disabled { /* all styles for Disabled */ }
.error { /* all styles for Error */ }
.inProgress { /* all styles for In Progress */
```

类名在工程中不需要唯一，可以看成是在JavaScript模块中使用的类在样式表中的别名

使用require或者import引入css

```
import styles from './submit-button.css';

buttonElem.outerHTML = `<button class=${styles.normal}>Submit</button>`
```

编译后最终生成

```
import { Component } from 'react';
import styles from './submit-button.css';

export default class SubmitButton extends Component {
  render() {
    let className, text = "Submit"
    if (this.props.store.submissionInProgress) {
      className = styles.inProgress
      text = "Processing..."
    } else if (this.props.store.errorOccurred) {
      className = styles.error
    } else if (!this.props.form.valid) {
      className = styles.disabled
    } else {
      className = styles.normal
    }
    return <button className={className}>{text}</button>
  }
}
```

```
<button class="components_submit_button__normal__abc5436">
  Processing...
</button>
```

### Composition 

```
.className {
  color: green;
  background: red;
}

.otherClassName {
  composes: className;
  color: yellow;
}
```

```
.common { /* font-sizes, padding, border-radius */ }
.normal { composes: common; /* blue color, light blue background */ }
.error { composes: common; /* red color, light red background */ }


.components_submit_button__common__abc5436 { /* font-sizes, padding, border-radius */ }
.components_submit_button__normal__def6547 { /* blue color, light blue background */ }
.components_submit_button__error__1638bcd { /* red color, light red background */ }

import styles from "./submit-button.css"

styles: {
  common: "components_submit_button__common__abc5436",
  normal: "components_submit_button__common__abc5436 components_submit_button__normal__def6547",
  error: "components_submit_button__common__abc5436 components_submit_button__error__1638bcd"
}
```

### Dependencies 继承样式

```
.otherClassName {
  composes: className from "./style.css";
}
```

### global 定义全局样式

```
:global(.clearfix::after) {
  content: '';
  clear: both;
  display: table;
}
```

## webpack和react中使用

[webpack-demo](https://github.com/css-modules/webpack-demo)

webpack将CSS文件作为CSS模块

```
{
  test: /\.css$/,
  loader: 'style!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]' 
}
```

[react-css-modules](https://github.com/gajus/react-css-modules)

```
import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './table.css';

class Table extends React.Component {
    render () {
        return <div styleName='table'>
            <div styleName='row'>
                <div styleName='cell'>A0</div>
                <div styleName='cell'>B0</div>
            </div>
        </div>;
    }
}

export default CSSModules(Table, styles);
```

使用styles可以重写组件的样式

```
import customStyles from './table-custom-styles.css';

<Table styles={customStyles} />;
```

```
/* table-custom-styles.css */
.table {
    composes: table from './table.css';
}

.row {
    composes: row from './table.css';
}

/* .cell {
    composes: cell from './table.css';
} */

.table {
    width: 400px;
}

.cell {
    float: left; width: 154px; background: #eee; padding: 10px; margin: 10px 0 10px 10px;
}
```

## 参考

[understanding-the-css-modules-methodology](http://www.zcfy.cc/article/understanding-the-css-modules-methodology-1329.html?hmsr=toutiao.io&utm_medium=toutiao.io&utm_source=toutiao.io)

[github-css-modules](https://github.com/css-modules/css-modules)

[css-modules](http://glenmaddern.com/articles/css-modules)