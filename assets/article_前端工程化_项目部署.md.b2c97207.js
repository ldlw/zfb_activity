import{_ as s,o as n,c as a,Q as p}from"./chunks/framework.00e71275.js";const h=JSON.parse('{"title":"项目部署解决方案","description":"项目部署解决方案","frontmatter":{"head":[["meta",{"name":"description","content":"项目部署解决方案"}],["meta",{"name":"keywords","content":"项目部署解决方案"}],["script",{"src":"https://vitepress-source.oss-cn-beijing.aliyuncs.com/statistics.js"}]]},"headers":[],"relativePath":"article/前端工程化/项目部署.md","filePath":"article/前端工程化/项目部署.md","lastUpdated":1668262405000}'),l={name:"article/前端工程化/项目部署.md"},o=p(`<h1 id="项目部署解决方案" tabindex="-1">项目部署解决方案 <a class="header-anchor" href="#项目部署解决方案" aria-label="Permalink to &quot;项目部署解决方案&quot;">​</a></h1><p>兄弟们圣诞节快乐，女朋友不在，在家肝代码一天，为了增加节日气氛 ☺ 给兄弟们总结一篇完整版本的前端快速部署代码的文章给助助兴。没做过的敲起来吧！</p><p>下面将介绍两种项目部署的方法，在我的理解里分别对应的是半自动部署和全自动部署</p><h2 id="半自动部署" tabindex="-1">半自动部署 <a class="header-anchor" href="#半自动部署" aria-label="Permalink to &quot;半自动部署&quot;">​</a></h2><p><img src="https://vitepress-source.oss-cn-beijing.aliyuncs.com/logo%20%281%29.png" alt="半自动部署"></p><p>半自动部署，顾名思义我们得做两次操作，整体思路是我们将开发的代码上传至<code>github</code>或者<code>gitee</code>,在服务器上将这个仓库克隆到一个<code>nginx</code>指定的文件夹下，当我们在开发机上完成了代码的开发，push 到仓库时，这时候手动通过 ssh 连接的方式进入服务器，服务器再将最新的代码 pull 下来。通过<code>docker</code>容器技术实现映射容器和 nginx 地址，完成部署。</p><p>注意：服务器上要有的环境<strong>git</strong>、<strong>node</strong>、<strong>nginx</strong>、<strong>docker</strong>（这点可选，如果不使用容器技术可以不用） 从步骤可以看出，整个服务器阶段要执行的命令还是蛮多的，如：</p><ul><li><code>git pull</code> 拉去代码</li><li>如果是 vue 或者其他脚手架项目可能还需要<code>npm install</code>，<code>npm run build</code>等等操作</li><li>操作 docker，如果存在这个容器，先删除再重新创建这个容器</li><li>... 这些操作我们不可能每次都去敲一遍，多几次就受不了了，所以我们可以创建一个<code>.sh</code>结尾的脚本文件，通过<code>sh</code>命令，来执行这个脚本</li></ul><h3 id="示例" tabindex="-1">示例 <a class="header-anchor" href="#示例" aria-label="Permalink to &quot;示例&quot;">​</a></h3><p>以下以一个 vuepress 项目作为例子</p><p>项目结构： <img src="https://vitepress-source.oss-cn-beijing.aliyuncs.com/1640422142%281%29.jpg" alt="目录结构"></p><ul><li>在 vuepress 项目根路径下创建一个<code>start.sh</code>脚本文件</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;"># 拉取代码</span></span>
<span class="line"><span style="color:#e1e4e8;">git pull</span></span>
<span class="line"><span style="color:#e1e4e8;"># 安装依赖</span></span>
<span class="line"><span style="color:#e1e4e8;">npm install &amp;&amp; npm run build</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;"># 删除容器</span></span>
<span class="line"><span style="color:#e1e4e8;">docker rm -f myblog &amp;&gt; /dev/null</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;"># 重启容器</span></span>
<span class="line"><span style="color:#e1e4e8;">docker run -d --restart=on-failure:5\\</span></span>
<span class="line"><span style="color:#e1e4e8;">    -p 3000:80 \\</span></span>
<span class="line"><span style="color:#e1e4e8;">    -v $PWD/public:/usr/share/nginx/html \\</span></span>
<span class="line"><span style="color:#e1e4e8;">    --name myblog nginx</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;"># 拉取代码</span></span>
<span class="line"><span style="color:#24292e;">git pull</span></span>
<span class="line"><span style="color:#24292e;"># 安装依赖</span></span>
<span class="line"><span style="color:#24292e;">npm install &amp;&amp; npm run build</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;"># 删除容器</span></span>
<span class="line"><span style="color:#24292e;">docker rm -f myblog &amp;&gt; /dev/null</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;"># 重启容器</span></span>
<span class="line"><span style="color:#24292e;">docker run -d --restart=on-failure:5\\</span></span>
<span class="line"><span style="color:#24292e;">    -p 3000:80 \\</span></span>
<span class="line"><span style="color:#24292e;">    -v $PWD/public:/usr/share/nginx/html \\</span></span>
<span class="line"><span style="color:#24292e;">    --name myblog nginx</span></span></code></pre></div><p>这里是创建一个<strong>myblog</strong>容器，这个容器将当前目录下的 public（vuepress 打包后的文件是在 publice 文件夹下，如果是 vue 项目这里需要改成 dist） 文件夹映射到 nginx 上，同时向外暴露的 3000 这个端口。</p><ul><li>服务器上通过<code>git clone</code>将项目克隆下来</li><li>执行<code>sh start.sh</code></li></ul><p><img src="https://vitepress-source.oss-cn-beijing.aliyuncs.com/1640422748%281%29.jpg" alt="执行结果"></p><p>如果出现以上的容器 id，那么恭喜你，部署完成，现在看看我们到浏览器试一下看看，输入<a href="http://1.116.204.114:3000" target="_blank" rel="noreferrer">http://1.116.204.114:3000</a></p><p><img src="https://vitepress-source.oss-cn-beijing.aliyuncs.com/1640422921%281%29.jpg" alt="浏览器访问"></p><p>完美！如果你不是使用容器技术，也是一样使用你的服务器 ip+nginx 配置的网站端口进行访问，就可以了。</p><p>之后如果有需要修改的内容，我们只需要在开发机上完成开发，push 到远程仓库上，之后进入服务器，执行一个我们创建的<code>start.sh</code>脚本，稍等片刻即可完成部署。</p><h2 id="全自动部署" tabindex="-1">全自动部署 <a class="header-anchor" href="#全自动部署" aria-label="Permalink to &quot;全自动部署&quot;">​</a></h2><p><img src="https://vitepress-source.oss-cn-beijing.aliyuncs.com/logo.png" alt="一键部署"></p><p>上面介绍的半自动部署其实已经是很方便了，但是当我们更新需求比较频繁的时候，多做几次也会受不了，所以下面介绍一个使用<code>github-action</code>完成更加简单的全自动部署。</p><p><code>github-action</code>顾名思义就是会捕获我们对 github 仓库的操作，其中就是我们的<code>push</code>操作，就是当我们在开发机中执行<code>git push</code>之后，github 可以捕获到这个操作，会将我们的代码自动的传输到我们服务器上，我们就省去了前面半自动部署的执行<code>sh</code>脚本的功能。</p><p>这个操作更方便，所以是实现这个操作的前期配置也就十分的繁琐，我是配了整整一上午终于整成功了，这里会涉及的配置有：</p><ul><li>我们开发机需要配置连接服务器的免密登录</li><li>设置 github 仓库的私钥为本地开发机的私钥</li><li>项目根目录下创建<code>.github/workflows/publish.yml</code></li><li>服务器配置 nginx 或者配置 docker</li></ul><h3 id="为什么要配置免密登录" tabindex="-1">为什么要配置免密登录？ <a class="header-anchor" href="#为什么要配置免密登录" aria-label="Permalink to &quot;为什么要配置免密登录？&quot;">​</a></h3><p>这里有个细节，这里的免密登录并不是代表我们在所有的电脑连接服务器都不需要输入密码，而是我们开发机连接服务器不需要输入密码，当我们连接的时候会自动的以我们开发机的 ssh 私钥作为密码进行匹配，如果匹配成功就会登录成功，因为这个过程是自动的，所以看起来跟不用输入密码一样，实际上是需要的。</p><h3 id="github-仓库私钥设置了干什么" tabindex="-1">github 仓库私钥设置了干什么？ <a class="header-anchor" href="#github-仓库私钥设置了干什么" aria-label="Permalink to &quot;github 仓库私钥设置了干什么？&quot;">​</a></h3><p>github 会以我们开发机的私钥作为密码去连接我们的服务器，服务器只看私钥，它发现私钥是正确的，就会给予通过，我们就能访问成功连接服务器，就可以传输文件了。</p><h3 id="示例-1" tabindex="-1">示例 <a class="header-anchor" href="#示例-1" aria-label="Permalink to &quot;示例&quot;">​</a></h3><p>以下以一个 vitepress 项目作为例子</p><p>项目结构</p><p><img src="https://vitepress-source.oss-cn-beijing.aliyuncs.com/1640424319%281%29.jpg" alt="项目结构"></p><p>.github/workflows/publish.yml</p><div class="language-yaml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">yaml</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#85E89D;">name</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">打包vitepress博客</span></span>
<span class="line"></span>
<span class="line"><span style="color:#79B8FF;">on</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#85E89D;">push</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;"># push 代码的时候 哪个分支会受到影响 这里是 master 主分支</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#85E89D;">branches</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">master</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 推送之后执行一系列的任务</span></span>
<span class="line"><span style="color:#85E89D;">jobs</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#85E89D;">build</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;"># 运行 ubuntu虚拟机系统</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#85E89D;">runs-on</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">ubuntu-latest</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#85E89D;">steps</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#6A737D;"># 获取代码</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#85E89D;">name</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">迁出代码</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;"># 使用action库 action/checkout获取大妈</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#85E89D;">uses</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">actions/checkout@master</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#6A737D;"># 安装Node10</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#85E89D;">name</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">安装node.js</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;"># 使用action库  actions/setup-node安装node</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#85E89D;">uses</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">actions/setup-node@v1</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#85E89D;">with</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#85E89D;">node-version</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">14.18.0</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#85E89D;">name</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">安装yarn</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#85E89D;">run</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">npm install -g yarn</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#6A737D;"># 安装依赖</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#85E89D;">name</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">安装依赖</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#85E89D;">run</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">yarn</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#6A737D;"># 打包</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#85E89D;">name</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">打包</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#85E89D;">run</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">yarn docs:build</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#6A737D;"># 上传到阿里云</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#85E89D;">name</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">发布到阿里云</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#85E89D;">uses</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">easingthemes/ssh-deploy@v2.1.1</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#85E89D;">env</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#6A737D;"># 私钥 PRIVATE_KEY 要和 仓库的私钥名一致 也就是私钥名也要叫 PRIVATE_KEY</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#85E89D;">SSH_PRIVATE_KEY</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">\${{ secrets.PRIVATE_KEY }}</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#6A737D;"># SCP参数</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#85E89D;">ARGS</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&#39;-avzr --delete&#39;</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#6A737D;"># 源目录 -- 打包后的文件目录，也就是这个文件会被传到服务器上</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#85E89D;">SOURCE</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&#39;docs/.vitepress/dist&#39;</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#6A737D;"># 服务器ip</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#85E89D;">REMOTE_HOST</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&#39;1.116.204.114&#39;</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#6A737D;"># 用户</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#85E89D;">REMOTE_USER</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&#39;root&#39;</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#6A737D;"># 目标地址 -- 上传到服务器的地址</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#85E89D;">TARGET</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&#39;/root/vitepress-blog&#39;</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#22863A;">name</span><span style="color:#24292E;">: </span><span style="color:#032F62;">打包vitepress博客</span></span>
<span class="line"></span>
<span class="line"><span style="color:#005CC5;">on</span><span style="color:#24292E;">:</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#22863A;">push</span><span style="color:#24292E;">:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;"># push 代码的时候 哪个分支会受到影响 这里是 master 主分支</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#22863A;">branches</span><span style="color:#24292E;">:</span></span>
<span class="line"><span style="color:#24292E;">      - </span><span style="color:#032F62;">master</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 推送之后执行一系列的任务</span></span>
<span class="line"><span style="color:#22863A;">jobs</span><span style="color:#24292E;">:</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#22863A;">build</span><span style="color:#24292E;">:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;"># 运行 ubuntu虚拟机系统</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#22863A;">runs-on</span><span style="color:#24292E;">: </span><span style="color:#032F62;">ubuntu-latest</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#22863A;">steps</span><span style="color:#24292E;">:</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;"># 获取代码</span></span>
<span class="line"><span style="color:#24292E;">      - </span><span style="color:#22863A;">name</span><span style="color:#24292E;">: </span><span style="color:#032F62;">迁出代码</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;"># 使用action库 action/checkout获取大妈</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#22863A;">uses</span><span style="color:#24292E;">: </span><span style="color:#032F62;">actions/checkout@master</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;"># 安装Node10</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">      - </span><span style="color:#22863A;">name</span><span style="color:#24292E;">: </span><span style="color:#032F62;">安装node.js</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;"># 使用action库  actions/setup-node安装node</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#22863A;">uses</span><span style="color:#24292E;">: </span><span style="color:#032F62;">actions/setup-node@v1</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#22863A;">with</span><span style="color:#24292E;">:</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#22863A;">node-version</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">14.18.0</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">      - </span><span style="color:#22863A;">name</span><span style="color:#24292E;">: </span><span style="color:#032F62;">安装yarn</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#22863A;">run</span><span style="color:#24292E;">: </span><span style="color:#032F62;">npm install -g yarn</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;"># 安装依赖</span></span>
<span class="line"><span style="color:#24292E;">      - </span><span style="color:#22863A;">name</span><span style="color:#24292E;">: </span><span style="color:#032F62;">安装依赖</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#22863A;">run</span><span style="color:#24292E;">: </span><span style="color:#032F62;">yarn</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;"># 打包</span></span>
<span class="line"><span style="color:#24292E;">      - </span><span style="color:#22863A;">name</span><span style="color:#24292E;">: </span><span style="color:#032F62;">打包</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#22863A;">run</span><span style="color:#24292E;">: </span><span style="color:#032F62;">yarn docs:build</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;"># 上传到阿里云</span></span>
<span class="line"><span style="color:#24292E;">      - </span><span style="color:#22863A;">name</span><span style="color:#24292E;">: </span><span style="color:#032F62;">发布到阿里云</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#22863A;">uses</span><span style="color:#24292E;">: </span><span style="color:#032F62;">easingthemes/ssh-deploy@v2.1.1</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#22863A;">env</span><span style="color:#24292E;">:</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#6A737D;"># 私钥 PRIVATE_KEY 要和 仓库的私钥名一致 也就是私钥名也要叫 PRIVATE_KEY</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#22863A;">SSH_PRIVATE_KEY</span><span style="color:#24292E;">: </span><span style="color:#032F62;">\${{ secrets.PRIVATE_KEY }}</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#6A737D;"># SCP参数</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#22863A;">ARGS</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&#39;-avzr --delete&#39;</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#6A737D;"># 源目录 -- 打包后的文件目录，也就是这个文件会被传到服务器上</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#22863A;">SOURCE</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&#39;docs/.vitepress/dist&#39;</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#6A737D;"># 服务器ip</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#22863A;">REMOTE_HOST</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&#39;1.116.204.114&#39;</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#6A737D;"># 用户</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#22863A;">REMOTE_USER</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&#39;root&#39;</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#6A737D;"># 目标地址 -- 上传到服务器的地址</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#22863A;">TARGET</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&#39;/root/vitepress-blog&#39;</span></span></code></pre></div><p>在仓库中设置私钥</p><p><img src="https://vitepress-source.oss-cn-beijing.aliyuncs.com/1640425145%281%29.jpg" alt="仓库设置私钥"></p><p>配置好以上的操作就可以，当我们代码写好了之后执行<code>git push</code>就可以前往 github 仓库下的<code>Actions</code>栏目下看进度了，这是个图形化的优雅界面，非常的 NICE</p><p><img src="https://vitepress-source.oss-cn-beijing.aliyuncs.com/1640424802%281%29.jpg" alt="ACTION结构"></p><p>这里如果最后的图标是绿色代表成功，红色代表失败，也可以点击进去看具体的内容，可以知道是哪里出错了。</p><p><img src="https://vitepress-source.oss-cn-beijing.aliyuncs.com/1640424936%281%29.jpg" alt="具体细节"></p><p>之后就可以前往服务器中查看指定目录下是否含有我们打包后的文件了，如果前面的步骤都没有报错，那么是肯定会有的。</p><p><img src="https://vitepress-source.oss-cn-beijing.aliyuncs.com/1640425323%281%29.jpg" alt="服务器中"></p><p>最后就是将这个目录映射至 nginx 了或者通过 docker 进行创建容器，我更倾向于后者，通过浏览器访问<a href="http://1.116.204.114:999" target="_blank" rel="noreferrer">http://1.116.204.114:999</a></p><p><img src="https://vitepress-source.oss-cn-beijing.aliyuncs.com/1640425453%281%29.jpg" alt="线上地址：http://1.116.204.114:999"></p><p>完美没有一点问题！之后我们如果修改内容，直接在开发机上进行编码，之后只需要执行<code>git push</code>github 就会在后台自动的帮我们上传文件，非常的爽！</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>通过<strong>github action</strong>是更香的方式，但如果是涉及一些后端的项目，比如 node.js 起的服务器我们更改代码需要通过 <code>pm2</code> 挂载，就会设置重启，等等一系列操作，还是半自动的设置<code>sh</code>脚本更加的灵活。但如果是前端的一些小网站，还是优选<strong>git action</strong></p><p>感谢看到这里，希望喜欢喜欢的小伙伴们可以点个赞，给我的 gitee 点点赞~</p>`,50),e=[o];function c(t,r,i,E,y,d){return n(),a("div",null,e)}const g=s(l,[["render",c]]);export{h as __pageData,g as default};
