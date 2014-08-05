---
layout: content
title: 主页
tagline: ''
---
{% include JB/setup %}
<div class="container-fluid">
  <div class="row">
    <div class="col-md-8">
    	<div class="panel panel-default">
		  <div class="panel-heading">
		  	<span class="glyphicon glyphicon-home"></span>
		  	主页
		  </div>
		  <div class="panel-body">
		  	主页  
		  </div>
		</div>
    </div>
  	<div class="col-md-4">
  		<div class="panel panel-default">
		  <div class="panel-heading">
		  	<span class="glyphicon glyphicon-book icon-margin"></span>
		  	最新文章
		  </div>
		  <div class="panel-body">
		    <ul class="posts">
			  {% for post in site.posts %}
			    <li>
			      <span>{{ post.date | date: "%F" }}</span>
			      &raquo; 
			      <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a>
			    </li>
			  {% endfor %}
			</ul>
		  </div>
		</div>
		<div class="panel panel-default">
		  <div class="panel-heading">
		  	<span class="glyphicon glyphicon-book icon-margin"></span>
		  	分类目录
		  </div>
		  <div class="panel-body">
		    <ul class="posts">
			  {% for category in site.categories %} 
		    	<li><a href="{{ BASE_PATH }}{{ site.JB.categories_path }}#{{ category | first }}-ref">
		    		{{ category | first }} <span>{{ category | last | size }}</span>
		    	</a></li>
		      {% endfor %}
			</ul>
		  </div>
		</div>
		<div class="panel panel-default">
		  <div class="panel-heading">
		  	<span class="glyphicon glyphicon-tags icon-margin"></span>
		  	标签
		  </div>
		  <div class="panel-body">
		    <ul>
			  {% assign tags_list = site.tags %}  
			  {% include JB/tags_list %}
			</ul>
		  </div>
		</div>
  	</div>

  	
  </div>
</div>



