---
layout: post
title: "Things that trip newbies in Powershell - Encodings"
date: 2013-02-18 11:46
comments: true
categories: [powershell, out-file, encoding, utf-8, utf-16]
published: true
excerpt: "Powershell has some quirks around text encodings that often trip new users. This post covers the common gotchas."
---

This is a follow up to the previous [post on things that trip newbies in Powershell](http://stacktoheap.com/blog/2012/12/16/things-that-trip-newbies-in-powershell/)

In this post, I will be concentrating on Encodings. When I began using Powershell, it managed to confuse, trick and irritate me a lot. Encodings issues continue to be problematic with Powershell even in v3.0.

Let me start off with a common enough usage that might come to bite you. Say you have a git repo. You can want to pipe some content to `.gitignore` to ignore some files and directories. Easy right?

You can do:

{% highlight powershell %}
"*.dll" > .gitignore
{% endhighlight %}

As any git user would know, that should ignore any dll file in your repo. But will it? Go ahead try it out.

{% highlight powershell %}
PS> git init .
PS> touch a.dll
PS> "*.dll" > .gitignore
PS> git add .
PS> git status
# On branch master
#
# Initial commit
#
# Changes to be committed:
#   (use "git rm --cached <file>..." to unstage)
#
#       new file:   .gitignore
#       new file:   a.dll
{% endhighlight %}

What??? Shouldn't `a.dll` be ignored. Let's see what's going on here:

{% highlight powershell %}
PS> git diff --cached
diff --git a/.gitignore b/.gitignore
new file mode 100644
index 0000000..2f14638
Binary files /dev/null and b/.gitignore differ
diff --git a/a.dll b/a.dll
new file mode 100644
index 0000000..e69de29
{% endhighlight %}

So git is treating the `.gitignore` file as a binary. This is where encodings come into the picture.

Doing `"*.dll" > .gitignore` is pretty much the same as doing `"*.dll" | out-file .gitignore`. The default encoding that is used here is `UCS-2`. Many tools like git are not happy with it, at least by default. 

We have this, from the [docs](http://technet.microsoft.com/en-us/library/dd347585.aspx):

{% blockquote %}
By default, the Out-File cmdlet creates a Unicode file. This is the best default in the long run, but it means that tools that expect ASCII files will not work correctly with the default output format. You can change the default output format to ASCII by using the Encoding parameter
{% endblockquote %}

To make git happy, you can convert the `.gitignore` file to, say  `ascii`. Actually, the `out-file` cmdlet provides ability to do just that.

{% highlight powershell %}
 "*.dll" | out-file -Encoding ascii .gitignore
{% endhighlight %}

Now, the dlls should be ignored as expected. Unfortunately, there is no way to change how `>` behaves in this aspect!