---
layout: post
title: "Building a Debian Wheezy vagrant box using veewee"
date: 2013-06-19 18:24
comments: true
categories: [debian, wheezy, vagrant, veewee, python]
excerpt: "A step-by-step guide to build a Debian Wheezy vagrant box using veewee"
---

For a Django website that I am working, which will be hosted on Debian 7.1, I needed a vagrant box that I can use during development. Unfortunately, such a box was not available at [vagrantbox.es](http://www.vagrantbox.es/) or elsewhere that I could trust, so I decided to build the box myself.

I did come across a [nice blog post](https://mikegriffin.ie/blog/20130418-creating-a-debian-wheezy-base-box-for-vagrant/) describing how to do the same, but it seemed like too many manual and repetitive steps ( across boxes ). Surely, there must be a tool to make it easier to create a vagrant box for any distribution?

It turns out that there is one - [Veewee](https://github.com/jedi4ever/veewee)

Installing `veewee` was pretty straightforward  and can be followed from the [docs](https://github.com/jedi4ever/veewee/blob/master/doc/installation.md)

Since I wanted to create a debian 7.1 box, I used the following command to find the template I wanted:

{% highlight bash %}
bundle exec veewee vbox templates | grep -i debian
{% endhighlight %}

Turns out I need `Debian-7.1.0-amd64-netboot`. So the step to define your box is as simple as:

{% highlight bash %}
bundle exec veewee vbox define 'debian-7.1.0' 'Debian-7.1.0-amd64-netboot'
{% endhighlight %}

At this point, you can change the defintions files to customize your box as needed. Going through the steps defined in various script files, you will also notice lot of similarities between what these scripts do and the manual steps described in the blog post mentioned earlier. I didn't really change any of the defaults, as this was my first try with the tool, and I wanted to see how it proceeds.

The next step is, of course, building the box:

{% highlight bash %}
bundle exec veewee vbox build 'debian-7.1.0'
{% endhighlight %}

This downloads the required ISO for you and builds the box as per your definitions. This would then open up VirtualBox (in my case) and setup the virtual box for you.

The last step is to export the box so that you can actually use it with Vagrant:

{% highlight bash %}
bundle exec veewee vbox export 'debian-7.1.0'
{% endhighlight %}

Neat, and simple! Of course, the meat of what veewee offers is in building custom boxes, and this just scratches the surface.