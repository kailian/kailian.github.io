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
		  	最新文章
		  </div>
		  <div class="panel-body">
        {% for post in site.posts %}
          <div class="col-md-12 page-header">    
            <h3>
              <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a><small> 
              {{ post.date | date: "%F" }}
              </small>
            </h3>           
          </div>
          <div class="col-md-12"> 
            {{ post.content  | | split:'<!--break-->' | first }}
            <a href="{{ post.url }}">.....</a>
          </div>
        {% endfor %}
		  </div>
		</div>
    </div>
  	<div class="col-md-4"> 		
  		<div class="panel panel-default">
  		  <div class="panel-heading">
  		  	<span class="glyphicon glyphicon-folder-open icon-margin"></span>
  		  	分类目录
  		  </div>
  		  <div class="panel-body">
  		    <div class="list-group">
  			  {% for category in site.categories %} 
            <a class="list-group-item" href="{{ BASE_PATH }}{{ site.JB.categories_path }}#{{ category | first }}-ref">
		    		{{ category | first }} 
            <span class="badge">{{ category | last | size }}</span>
  		    	</a>
  		      {% endfor %}
  			  </div>
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
      <div class="panel panel-default">
        <div class="panel-heading">
          <span class="glyphicon glyphicon-th icon-margin"></span>
          关于
        </div>
        <div class="panel-body">
          博客文章统计：
        </div>
      </div>
  	</div>  	
  </div>
</div>



