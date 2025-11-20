---
layout: default
title: Durham ARC Training Courses
---

<div class="container">
    <header>
        <h1>{{ site.title }}</h1>
        <p>{{ site.description }}</p>
        
        <div class="arc-link">
            <a href="{{ site.durham_arc_url }}" class="btn btn-highlight" target="_blank">
                View Official Durham ARC Training Calendar
            </a>
        </div>
    </header>
    
    <main>
        <!-- Available Courses Section -->
        <section>
            <h2>Available Courses</h2>
            
            {% if site.data.courses and site.data.courses.materials and site.data.courses.materials.size > 0 %}
            <div class="course-grid">
                {% for material in site.data.courses.materials %}
                <div class="course-card">
                    <h3>{{ material.name }}</h3>
                    <p>{{ material.description }}</p>
                    
                    {% if material.topics.size > 0 %}
                    <div class="topics">
                        {% for topic in material.topics %}
                        <span class="topic-tag">{{ topic }}</span>
                        {% endfor %}
                    </div>
                    {% endif %}
                    
                    <div class="course-links">
                        {% if material.pages_url %}
                        <a href="{{ material.pages_url }}" class="btn btn-primary">Course Materials</a>
                        {% endif %}
                        <a href="{{ material.repo_url }}" class="btn btn-secondary">GitHub Repo</a>
                    </div>
                    
                    {% if material.is_fork %}
                    <p class="fork-notice">
                        <em>Adapted from Software Carpentry materials</em>
                    </p>
                    {% endif %}
                </div>
                {% endfor %}
            </div>
            {% else %}
            <p class="no-data">No course materials available yet. Check back soon!</p>
            {% endif %}
        </section>
        
        <!-- Upcoming Course Instances Section -->
        <section id="upcoming">
            <h2>Upcoming Course Instances</h2>
            
            {% assign today = 'now' | date: '%Y-%m-%d' %}
            {% assign upcoming = "" | split: "," %}
            {% if site.data.courses and site.data.courses.instances %}
                {% assign upcoming = site.data.courses.instances | where_exp: "item", "item.date >= today" | sort: "date" %}
            {% endif %}
            
            {% if upcoming.size > 0 %}
            <table class="upcoming-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Course</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    {% for instance in upcoming %}
                    <tr>
                        <td>{{ instance.date | date: "%B %d, %Y" }}</td>
                        <td>{{ instance.course_type }}</td>
                        <td>
                            <a href="{{ instance.url }}">Course Page</a>
                            {% if instance.description != '' %}
                            <br><small>{{ instance.description }}</small>
                            {% endif %}
                        </td>
                    </tr>
                    {% endfor %}
                </tbody>
            </table>
            {% else %}
            <p class="no-data">No upcoming courses scheduled. Check the <a href="{{ site.durham_arc_url }}" target="_blank">official Durham ARC training calendar</a> for the latest information.</p>
            {% endif %}
        </section>
        
        <!-- Past Course Instances Section -->
        <section id="past">
            <h2>Past Course Instances</h2>
            
            {% assign past = "" | split: "," %}
            {% if site.data.courses and site.data.courses.instances %}
                {% assign past = site.data.courses.instances | where_exp: "item", "item.date < today" | sort: "date" | reverse %}
            {% endif %}
            
            {% if past.size > 0 %}
            <details>
                <summary>View {{ past.size }} past course{% if past.size != 1 %}s{% endif %}</summary>
                
                <table class="past-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Course</th>
                            <th>Materials</th>
                        </tr>
                    </thead>
                    <tbody>
                        {% for instance in past limit:20 %}
                        <tr>
                            <td>{{ instance.date | date: "%B %d, %Y" }}</td>
                            <td>{{ instance.course_type }}</td>
                            <td><a href="{{ instance.url }}">View Materials</a></td>
                        </tr>
                        {% endfor %}
                    </tbody>
                </table>
                
                {% if past.size > 20 %}
                <p class="archive-note">Showing 20 most recent courses. Visit our <a href="https://github.com/{{ site.github_org }}" target="_blank">GitHub organization</a> for complete archive.</p>
                {% endif %}
            </details>
            {% else %}
            <p class="no-data">No past courses recorded yet.</p>
            {% endif %}
        </section>
        
        <!-- About Section -->
        <section>
            <h2>About Durham ARC</h2>
            <p>
                Durham Advanced Research Computing provides training and support for researchers at Durham University. 
                Our courses are designed to help you develop essential computational skills, from version control to 
                parallel programming. We follow Software Carpentry teaching methods, emphasizing hands-on learning 
                and peer support.
            </p>
            <p>
                Many of our courses are based on or adapted from <a href="https://software-carpentry.org/" target="_blank">Software Carpentry</a> 
                materials, which are openly licensed and community-developed.
            </p>
        </section>
        
        {% if site.data.courses.last_updated %}
        <section class="metadata">
            <p class="last-updated">
                <small>Course data last updated: {{ site.data.courses.last_updated | date: "%B %d, %Y at %H:%M UTC" }}</small>
            </p>
        </section>
        {% endif %}
    </main>
    
    <footer>
        <p>
            <strong>{{ site.title }}</strong><br>
            Part of <a href="https://github.com/{{ site.github_org }}" target="_blank">{{ site.github_org }}</a><br>
            <a href="{{ site.durham_arc_url }}" target="_blank">Durham University Advanced Research Computing</a>
        </p>
    </footer>
</div>