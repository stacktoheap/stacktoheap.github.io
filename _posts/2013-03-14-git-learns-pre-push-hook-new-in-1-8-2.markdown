---
layout: post
title: "git learns pre-push hook - new in 1.8.2"
date: 2013-03-14 09:40
comments: true
categories: [git, 1.8.2, pre-push, hook]
excerpt: "A new feature in Git 1.8.2 - pre-push hook to control what gets pushed out."
---

The 1.8.2 version of Git is here and one of the most sought features in git finally reaches the fans - the `pre-push` hook.

Go ahead, install the new version of git and do a `git init` or `git init --bare`. Under the `hooks` folder, you should see a sample for the brand new `pre-push` hook. Yay!

This is what the top comments of the `pre-push` script say:

{% highlight bash %}
#!/bin/sh

# An example hook script to verify what is about to be pushed.  Called by "git
# push" after it has checked the remote status, but before anything has been
# pushed.  If this script exits with a non-zero status nothing will be pushed.
#
# This hook is called with the following parameters:
#
# $1 -- Name of the remote to which the push is being done
# $2 -- URL to which the push is being done
#
# If pushing without using a named remote those arguments will be equal.
#
# Information about the commits which are being pushed is supplied as lines to
# the standard input in the form:
#
#   <local ref> <local sha1> <remote ref> <remote sha1>
#
# This sample shows how to prevent push of commits where the log message starts
# with "WIP" (work in progress).
{% endhighlight %}

That seems pretty simple, and in line with other hooks. The example is also pretty useful, helping you block pushes containing commits with message starting with "WIP".

So what are the scenarios for using this? Come on, do you really need a reason to use something as good as this? Well anyways, one thing that comes into mind is automatically running your local builds / tests just before pushing the commits to remote. If they fail, don't push.
