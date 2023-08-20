---
layout: post
title: "Using git at a hackathon where git:// port is blocked"
date: 2013-08-24 15:29
comments: true
categories: [git,https,git protocol]
excerpt: "A quick guide to using git over https instead of git protocol when the latter is blocked."
---

Stuck in a network where the `git://` protocol is blocked ( port 9418)?

I was. At a hackathon and having to do `bower install`, where a lot of packages were installed through "git://" from Github. Unfortunately, the port was blocked and the installation was not going through.

One option under such scenarios is to ask git to use the `https://` protocol ( hopefully, that one is open ) instead of the `git://`.

It can be simply done as follow:

{% highlight bash %}
git config --global url."https://".insteadOf "git://"
{% endhighlight %}

This is not just for changing the protocol, but for replacing the beginning part of ANY url with the one you specify. In our case, we are replacing urls beginning with `git://` to `https://`. 

A simple solution, instead of having to get the port opened, etc. Just remember to unset this config once done.