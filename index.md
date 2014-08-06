---
layout: content
title: 主页
tagline: ''
---
{% include JB/setup %}
<div class="container">
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
		  	<span class="glyphicon glyphicon-folder-open icon-margin"></span>
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
		    	{% for tag in site.tags %} 
			    <div class="lable-margin blog-left">
			      <button class="btn btn-primary btn-sm" type="button">
			        <a href="{{ BASE_PATH }}{{ site.JB.tags_path }}#{{ tag[0] }}-ref">
			          <span class="tag-color">{{ tag[0] }}</span>
			          <span class="badge">{{ tag[1].size }}</span>
			        </a>
			      </button>
			    </div>
			    {% endfor %}
		  </div>
		</div>
  	</div>

  	
  </div>
</div>



