---
title: DVWA靶场练习笔记
date: 2023-11-01 16:03:18
tags: 自学
categories: 信息安全
---
发现了一个很棒的靶场，里面囊括了Web方向的大多数常见漏洞，并且还分了四个难度等级（Low,Medium,High,Impossible），很适合目前我的需求。

<!--more-->

TODO:

* [ ] Low
* [ ] Medium
* [ ] High
* [ ] Impossible

<details>

<summary>Brute Force(暴力破解)</summary>

<details>

<summary>Low</summary>

![1698826342694](./images/DVWA靶场练习笔记/1698826342694.png)

先随意选择一组用户名和密码看看会发生什么。

![1698827316880](./images/DVWA靶场练习笔记/1698827316880.png)

显示用户名和/或密码错误，除此之外没有任何的机制。所以考虑使用Burp的Intruder模块对用户名和密码进行爆破。

这里由于username和password都需要爆破。所以考虑Pitchfork模块或者Cluster Bomb模块（Sniper和Batteringram只能导入一个payload），这里选择Clusterbomb。

选择字典之后开始爆破。

![1698831896134](./images/DVWA靶场练习笔记/1698831896134.png)

发现了一个长度明显有差异的返回长度。输入进去。

![1698831967463](./images/DVWA靶场练习笔记/1698831967463.png)

</details>

</details>

---

<details>
<summary>Command Injection(指令注入)</summary>
<details>
<summary>Low</summary>

![1698843230447](./images/DVWA靶场练习笔记/1698843230447.png)
~~（是知识盲区~~  尝试着分析了一下，工作原理可能是直接将输入框内的文字与ping命令进行拼接。

![1698843498673](./images/DVWA靶场练习笔记/1698843498673.png)

并且不能过滤不合法的输入，那么尝试一下用&符号进行注入。~~（windows命令行指令都是啥来着~~

![1698843906106](./images/DVWA靶场练习笔记/1698843906106.png)

</details>
</details>

---

<details>
<summary>CSRF(Cross Site Request Forgery)(跨站请求伪造)</summary>
<details>
<summary>Low</summary>

![1698844012937](./images/DVWA靶场练习笔记/1698844012937.png)

尝试抓个包。

![1698845752819](./images/DVWA靶场练习笔记/1698845752819.png)

发现是直接传递了新的密码和确认的密码，同时查看源代码发现是直接判断New password和Conf password是否相等，并没有其他的验证。

![1700221775155](./images/DVWA靶场练习笔记/1700221775155.png)

~~普通版burp不具备生成CSRF poc的功能，换个工具先（~~    burp汉化破解链接 `https://www.52pojie.cn/thread-1544866-1-1.html`

或者不使用poc工具，直接构造链接 `http://127.0.0.1/DVWA-2.3/vulnerabilities/csrf/?password_new=123&password_conf=123&Change=Change#` 即可 ，或者再用短链接生成器包装一下看着像那么回事也可以。

</details>
</details>

---

<details>
<summary>File Inclusion(文件包含)</summary>
<details>

<summary>Low</summary>

![1698849299946](./images/DVWA靶场练习笔记/1698849299946.png)

页面上给了三个php文件，逐个点击后没有发现特别有用的信息。

![1698849364929](./images/DVWA靶场练习笔记/1698849364929.png)

![1698849376545](./images/DVWA靶场练习笔记/1698849376545.png)![1698849392702](./images/DVWA靶场练习笔记/1698849392702.png)

然后注意到了浏览器的网址栏，发现所谓php文件的读取是直接将php文件传入page中再读出来，联系到标题的文件隐藏，尝试着将page=file3.php改成page=file4.php。

![1698849666992](./images/DVWA靶场练习笔记/1698849666992.png)

</details>
</details>

---

<details>
<summary>File Upload(文件上传漏洞)</summary>
<details>
<summary>Low</summary>

![1700222526114](./images/DVWA靶场练习笔记/1700222526114.png)

虽然说是上传图片，但是源代码中没有对上传文件的格式作要求

一句话木马干就完了 `<?php @eval($_POST['z']);?>`

~~tmd卡巴斯基怎么又给我的文件清理了~~

![1700466093449](./images/DVWA靶场练习笔记/1700466093449.png)

上传成功，可以看到下面回显了路径，然后用蚁剑连接或者拼接路径也可以

![1700466460394](./images/DVWA靶场练习笔记/1700466460394.png)

成功（记得把php文件删掉

</details>
</details>

---

<details>
<summary>Insecure CAPTCHA(不安全验证码)</summary>

**因配置验证码的key有问题，所以暂时搁置**

</details>

---
<details>

<summary>SQL Injection(SQL注入)</summary>

<details>
<summary>Low</summary>

![1700468784744](./images/DVWA靶场练习笔记/1700468784744.png)

> SQL注入的第一步就要判断注入类型。一般来说，SQL注入按照**参数分类**分为：**字符型**和**数字型**，按照**页面回显**分为**回显注入**和**盲注**，**回显**分为**回显正常**和**回显报错**，**盲注**分为**时间盲注**和**布尔盲注**。
>
> [漏洞挖掘学习笔记 | Eklos&#39;s Blog (eklos9z.github.io)](https://eklos9z.github.io/2023/10/22/%E6%BC%8F%E6%B4%9E%E6%8C%96%E6%8E%98%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0/#more)

![1700541103208](./images/DVWA靶场练习笔记/1700541103208.png)

</details>
</details>
