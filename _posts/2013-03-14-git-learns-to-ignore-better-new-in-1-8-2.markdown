---
layout: post
title: "git learns to ignore better - new in 1.8.2"
date: 2013-03-14 10:53
comments: true
categories: [git, 1.8.2, gitignore, check-ignore]
excerpt: "A new feature in Git 1.8.2 - better ignoring of files through .gitignore and git check-ignore."
---

The new version of git - 1.8.2 is here and with it, git is better at ignoring things. The files and directories in your repository, that is.

From the [1.8.2 release notes](https://git.kernel.org/cgit/git/git.git/plain/Documentation/RelNotes/1.8.2.txt) you can see the following:

{% blockquote %}
The patterns in .gitignore and .gitattributes files can have **/, as a pattern that matches 0 or more levels of subdirectory. E.g. "foo/**/bar" matches "bar" in "foo" itself or in a subdirectory of "foo".
{% endblockquote %}

This is great for ignoring, say `lib` folders within your `src` folder, but not ignoring `lib` folders elsewhere, especially, the root of your repsoitory. All the gross ways of achieving something like the above can be, well, ignore, and we can start using this.

Wait! 1.8.2 has even more in the art of ignoring thing:

{% blockquote %}
"git check-ignore" command to help debugging .gitignore files has been added.
{% endblockquote %}

This seems neat! I have seen so many people struggle with trying to understand what is being ignored and what is not. Let's see how this new command can help.

You can pass path(s) to the `git check-ignore` command and it will tell you the pattern from `.gitignore` or elsewhere that ends up ignoring the path(s).

Let's try it out:

{% highlight bash %}
git init .
touch afile
mkdir bin
touch bin/abin.dll
echo "bin/" > .gitignore
{% endhighlight %}

Now if you do `git check-ignore bin` or `git check-ignore bin/abin.dll`, the command will spew back the paths, confirming that they are ignored. Of course, the `git check-ignore` command can go even further:

{% highlight bash %}
$ git check-ignore bin/a.dll --verbose
.gitignore:1:bin/   bin/a.dll
{% endhighlight %}

When you use the `--verbose` flag, it tells you the source of the ignore pattern, the line number, the pattern itself and the path being ignored because of the pattern.

While most of the times our git ignores are pretty simple like `bi/` or `*.dll`, but [for the times when things go out of hand](http://stackoverflow.com/q/5738204/526535), it makes sense to use the `git check-ignore` command to debug what is going on.





