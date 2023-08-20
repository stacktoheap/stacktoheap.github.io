---
layout: post
title: "Why use virtualenv when there is pythonbrew?"
date: 2013-03-11 23:30
comments: true
categories: [virtualenv, python, rvm, pythonbrew]
excerpt: "A comparison of virtualenv vs pythonbrew for managing python environments"
---

One of the first things that people coming from the Ruby / Rails world and entering the amazing world of Python / Django ( ahem ) want to know is what is the equivalent of `rvm`? Or to be more generic, how does one manage their "pythons" and the manage their "gemsets"

I see that newcomers to Python are still being pointed to `virtualenv` and then to the `virtualenvwrapper` which apparently makes working with `virtualenv` much easier. As someone coming back to the world of Python, from the days of installing all the packages for every project that your are working on system wide, I too, was led towards the aforementioned duo.

Until I came across [pythonbrew](https://github.com/utahta/pythonbrew), that is. It describes itself rather modestly as "..a program to automate the building and installation of Python in the users $HOME", and claims to be inspired by `rvm` itself.

What many don't seem to realize is that `pythonbrew` itself is a wrapper to `virtualenv` and allows the ability to manage virtual environments in addition to your pythons.  The interface is consistent and it does more than what `virtualenv` or `virtualenvwrapper` do.

This is how you create and use virtual environments with pythonbrew:

{% highlight bash %}
pythonbrew venv create proj
pythonbrew venv use proj
{% endhighlight %}

This is how you do it with virtualenv:

{% highlight bash %}
virtualenv proj
source bin/activate
{% endhighlight %}

Bit better with `virtualenvwrapper`:

{% highlight bash %}
mkvirtualenv proj #this also activates it
#later
workon proj
{% endhighlight %}

Can you see the consistency in interface with pythonbrew that I am talking about? One you start with `pythonbrew`, you know where to go next. What the next step would be. Maybe I am spoilt by `rvm`, but `pythonbrew` just seems to be right approach here for me. The fact that it uses `virtualenv` under the wraps means you can always go down a level and use it directly.

 With the 2.7.x python and 3.x python being used simultaneously, I surely hope people do need easy ways to install and use multiple pythons, in addition to managing the packages.

 I have been using `pythonbrew` in my Django project and have had absolutely no problems with it. I had no problems setting up `Pycharm` with it, as well. It is exactly what I needed, without the complexity of the `virtualenv` interface, with a consistent way of doing things, and similarity to `rvm`. 

 So my question to pythonistas is, why do you still use / recommend virtualenv ( alone ) when there is pythonbrew? Or am is just reading old docs and blogs?